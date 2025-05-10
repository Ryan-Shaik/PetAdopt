const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET; // Assumes JWT_SECRET is loaded via dotenv in server.js

    const authMiddleware = (req, res, next) => {
        // Get token from header
        const authHeader = req.header('Authorization');

        // Check if not token
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token, authorization denied.' });
        }

        try {
            // Extract token
            const token = authHeader.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Add user from payload to request object
            // Ensure your JWT payload structure matches { user: { id: ..., ... } }
            if (!decoded.user || !decoded.user.id) {
                 console.error('JWT verification successful, but payload structure is unexpected:', decoded);
                 return res.status(401).json({ message: 'Token payload is invalid.' });
            }
            req.user = decoded.user; // Attach the user object { id, name, email, role } from the token
            next(); // Proceed to the next middleware or route handler

        } catch (err) {
            console.error('Token verification failed:', err.message);
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired.' });
            }
             if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token is not valid.' });
            }
            res.status(500).json({ message: 'Server error during token validation.' });
        }
    };

    module.exports = authMiddleware;