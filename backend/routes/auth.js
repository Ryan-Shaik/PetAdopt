const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User'); // Adjust path if needed
const sendEmail = require('../utils/email'); // Import email utility
const { Op } = require('sequelize'); // Import Op for query operators
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; // Frontend URL for reset links


if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    process.exit(1); // Exit if JWT_SECRET is missing
}

// --- Get Current User Route ---
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user is attached by the authMiddleware and contains the user data from token
        console.log(`Fetching data for user ID: ${req.user.id}`);
        
        const user = await User.findByPk(req.user.id, {
            // Exclude sensitive fields
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
        });

        if (!user) {
            // This case might happen if the user was deleted after the token was issued
            console.warn(`User ID ${req.user.id} from valid token not found in database.`);
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user); // Send back the user data
    } catch (error) {
        console.error('Error fetching user data in /me route:', error);
        res.status(500).json({ message: 'Server error fetching user data.' });
    }
});

// --- Registration Route ---
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please provide name, email, password, and role.' });
    }
    if (!['Adopter', 'Shelter', 'Admin'].includes(role)) {
         return res.status(400).json({ message: 'Invalid role specified.' });
    }
     // Prevent self-registration as Admin (should be done manually or via specific process)
    if (role === 'Admin') {
        return res.status(403).json({ message: 'Admin registration is not allowed through this endpoint.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use.' });
        }

        // Create new user (password hashing is handled by the model hook)
        const newUser = await User.create({
            name,
            email,
            password,
            role,
            // Add shelter details if role is Shelter and they are provided
            // shelterName: role === 'Shelter' ? req.body.shelterName : null,
            // shelterAddress: role === 'Shelter' ? req.body.shelterAddress : null,
            // shelterStatus: role === 'Shelter' ? 'Pending' : null, // Default shelter status
        });

        // Exclude password from the response
        const userResponse = { ...newUser.toJSON() };
        delete userResponse.password;

        res.status(201).json({ message: 'User registered successfully.', user: userResponse });

    } catch (error) {
        console.error("Registration error:", error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
        }
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// --- Login Route ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`--- Login attempt for email: ${email} ---`); // Log attempt

    if (!email || !password) {
        console.log('Login failed: Missing email or password.');
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Find user by email
        console.log(`Searching for user with email: ${email}`);
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log(`Login failed: User not found for email: ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // User not found
        }

        // User found, log basic info (excluding password hash)
        console.log(`User found: ID ${user.id}, Role ${user.role}`);
        console.log('Comparing provided password with stored hash...');

        // Check password validity
        const isMatch = await user.validPassword(password);

        console.log(`Password match result: ${isMatch}`); // Log the result of the comparison

        if (!isMatch) {
            console.log(`Login failed: Password does not match for user ID ${user.id}`);
            return res.status(401).json({ message: 'Invalid credentials.' }); // Incorrect password
        }

        // Password matches! Proceed with JWT generation
        console.log(`Login successful for user ID ${user.id}. Generating token...`);

        // Check if shelter account is approved (if applicable)
        // if (user.role === 'Shelter' && user.shelterStatus !== 'Approved') {
        //     return res.status(403).json({ message: 'Shelter account pending approval or rejected.' });
        // }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1d' }, // Token expires in 1 day (adjust as needed)
            (err, token) => {
                if (err) {
                    console.error("JWT Sign Error:", err); // Log JWT specific errors
                    throw err; // Rethrow to be caught by outer catch block
                }
                // Exclude password from user data sent back
                const userResponse = { ...user.toJSON() };
                delete userResponse.password;
                console.log(`Token generated successfully for user ID ${user.id}`);
                res.json({ token, user: userResponse });
            }
        );

    } catch (error) {
        console.error("Login process error:", error); // Log any unexpected errors during the process
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// --- Forgot Password Route ---
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
    }

    console.log(`Forgot password request for email: ${email}`);

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            // Security: Don't reveal if the email exists or not
            console.log(`Forgot password: User not found for email ${email}, sending generic response.`);
            return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        // Set expiration time (1 hour)
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in milliseconds

        await user.save();
        console.log(`Reset token generated for user ID ${user.id}`);

        // Create reset URL
        const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        const subject = 'Password Reset Request for PetAdopt';
        const textBody = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nThis link will expire in one hour.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;
        const htmlBody = `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
                         <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                         <p><a href="${resetUrl}">${resetUrl}</a></p>
                         <p>This link will expire in one hour.</p>
                         <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

        await sendEmail({
            to: user.email,
            subject: subject,
            text: textBody,
            html: htmlBody,
        });

        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        // Avoid sending detailed errors back
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});

// --- Reset Password Route ---
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'New password is required.' });
    }
    // Add password complexity check
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    console.log(`Reset password attempt with token: ${token}`);

    try {
        // Find user by token and check expiration
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() } // Check if expiration is greater than now
            }
        });

        if (!user) {
            console.log(`Reset password failed: Invalid or expired token: ${token}`);
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }

        // Token is valid, update password (hook will hash it)
        user.password = password;
        user.resetPasswordToken = null; // Clear the token
        user.resetPasswordExpires = null; // Clear expiration

        await user.save();
        console.log(`Password successfully reset for user ID ${user.id}`);

        // Send confirmation email
        try {
            await sendEmail({
                to: user.email,
                subject: 'Your PetAdopt Password Has Been Changed',
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
                html: `<p>Hello,</p><p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`
            });
        } catch (emailError) {
            console.error(`Failed to send password change confirmation email to ${user.email}:`, emailError);
            // Don't fail the whole request if confirmation email fails
        }

        res.status(200).json({ message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'An error occurred while resetting the password.' });
    }
});

module.exports = router;
