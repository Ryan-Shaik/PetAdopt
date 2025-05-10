const express = require('express');
    const { Op } = require('sequelize');
    const db = require('../models'); // Use models from index
    const authMiddleware = require('../middleware/authMiddleware');
    const sendEmail = require('../utils/email'); // Import email utility

    const router = express.Router();
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    // --- Middleware to check for Shelter role ---
    const isShelter = (req, res, next) => {
        if (req.user && req.user.role === 'Shelter') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Shelter role required.' });
        }
    };

    // --- SUBMIT: Create a new Application (User only) ---
    router.post('/', authMiddleware, async (req, res) => {
        const applicantId = req.user.id; // From logged-in user
        const { petId, applicantMessage, homeEnvironment } = req.body;

        // Basic validation
        if (!petId) {
            return res.status(400).json({ message: 'Pet ID is required.' });
        }
        // Add more validation for homeEnvironment etc. if made mandatory

        try {
            // 1. Find the Pet and its Shelter
            const pet = await db.Pet.findByPk(petId, { include: { model: db.User, as: 'shelter' } });
            if (!pet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }
            if (pet.adoptionStatus !== 'Available') {
                return res.status(400).json({ message: `Pet "${pet.name}" is not available for adoption.` });
            }
            if (!pet.shelter || !pet.shelter.id) {
                 return res.status(500).json({ message: 'Could not determine the shelter for this pet.' });
            }
            const shelterId = pet.shelter.id;

            // 2. Check if user already applied for this pet (optional, prevent duplicates)
            const existingApplication = await db.Application.findOne({
                where: { applicantId, petId, status: { [Op.ne]: 'Withdrawn' } } // Check non-withdrawn applications
            });
            if (existingApplication) {
                 return res.status(409).json({ message: 'You have already submitted an application for this pet.' });
            }

            // 3. Create the Application
            const newApplication = await db.Application.create({
                applicantId,
                petId,
                shelterId, // Store the shelter ID
                applicantMessage,
                homeEnvironment,
                status: 'Pending', // Default status
            });

            // 4. (Optional) Send notification email to Shelter
            try {
                await sendEmail({
                    to: pet.shelter.email, // Assuming shelter user has email
                    subject: `New Adoption Application for ${pet.name}`,
                    text: `You have received a new adoption application for ${pet.name} from ${req.user.name}.\n\nPlease log in to your dashboard to review it.`,
                    html: `<p>You have received a new adoption application for <strong>${pet.name}</strong> from ${req.user.name}.</p><p>Please log in to your dashboard to review it.</p>`
                });
            } catch (emailError) {
                 console.error(`Failed to send new application notification to shelter ${shelterId}:`, emailError);
                 // Don't fail the request if email fails
            }


            res.status(201).json(newApplication);

        } catch (error) {
            console.error('Error submitting application:', error);
            res.status(500).json({ message: 'Server error submitting application.' });
        }
    });

    // --- GET: User's submitted applications ---
    router.get('/my-applications', authMiddleware, async (req, res) => {
        const applicantId = req.user.id;
        try {
            const applications = await db.Application.findAll({
                where: { applicantId },
                include: [
                    { model: db.Pet, attributes: ['id', 'name', 'imageUrl'] }, // Include basic pet info
                    { model: db.User, as: 'shelter', attributes: ['id', 'name'] } // Include basic shelter info
                ],
                order: [['createdAt', 'DESC']]
            });
            res.json(applications);
        } catch (error) {
            console.error('Error fetching user applications:', error);
            res.status(500).json({ message: 'Server error fetching applications.' });
        }
    });

    // --- GET: Shelter's received applications ---
    router.get('/shelter', authMiddleware, isShelter, async (req, res) => {
        const shelterId = req.user.id;
        try {
            // Find applications where the shelterId matches the logged-in shelter
            const applications = await db.Application.findAll({
                where: { shelterId },
                include: [
                    { model: db.Pet, attributes: ['id', 'name', 'imageUrl'] }, // Include pet info
                    { model: db.User, as: 'applicant', attributes: ['id', 'name', 'email'] } // Include applicant info
                ],
                order: [['createdAt', 'DESC']]
            });
            res.json(applications);
        } catch (error) {
            console.error('Error fetching shelter applications:', error);
            res.status(500).json({ message: 'Server error fetching applications.' });
        }
    });

    // --- UPDATE: Shelter updates application status ---
    router.put('/:id/status', authMiddleware, isShelter, async (req, res) => {
        const { id } = req.params;
        const shelterId = req.user.id;
        const { status, shelterNotes } = req.body; // Expecting new status ('Approved', 'Rejected')

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided. Must be "Approved" or "Rejected".' });
        }

        try {
            // Find the application and verify ownership via shelterId
            const application = await db.Application.findOne({
                where: { id, shelterId },
                include: [ // Include related data needed for notifications/logic
                     { model: db.User, as: 'applicant', attributes: ['id', 'name', 'email'] },
                     { model: db.Pet, attributes: ['id', 'name', 'adoptionStatus'] }
                ]
            });

            if (!application) {
                return res.status(404).json({ message: 'Application not found or you do not have permission to modify it.' });
            }

            if (application.status !== 'Pending') {
                 return res.status(400).json({ message: `Application status is already "${application.status}". Cannot change.` });
            }

            // Update application status and notes
            application.status = status;
            application.shelterNotes = shelterNotes || application.shelterNotes; // Keep old notes if new ones aren't provided
            application.decisionDate = new Date();

            await application.save();

            // --- Post-decision Logic ---
            let petUpdatePromise = null;
            if (status === 'Approved') {
                // Set Pet status to 'Pending' or 'Adopted' (decide workflow)
                // For now, let's set to 'Pending' assuming further steps
                if (application.Pet.adoptionStatus === 'Available') {
                     petUpdatePromise = application.Pet.update({ adoptionStatus: 'Pending' });
                     console.log(`Pet ID ${application.petId} status updated to Pending due to application approval.`);
                }
                // TODO: Optionally reject other pending applications for the same pet?
            }
            // If status is 'Rejected', pet status might revert to 'Available' if it was 'Pending' due to this app? Needs careful thought.

            if (petUpdatePromise) {
                await petUpdatePromise; // Wait for pet status update if initiated
            }

            // --- Send Notification Email to Applicant ---
            try {
                const applicant = application.applicant;
                const petName = application.Pet.name;
                const subject = `Update on your adoption application for ${petName}`;
                let emailText = `Hello ${applicant.name},\n\nThere's an update on your adoption application for ${petName}.\n\nStatus: ${status}\n`;
                let emailHtml = `<p>Hello ${applicant.name},</p><p>There's an update on your adoption application for <strong>${petName}</strong>.</p><p><strong>Status: ${status}</strong></p>`;

                if (shelterNotes) {
                    emailText += `Shelter Notes: ${shelterNotes}\n`;
                    emailHtml += `<p><strong>Shelter Notes:</strong></p><p>${shelterNotes}</p>`;
                }
                 if (status === 'Approved') {
                     emailText += `\nThe shelter will contact you regarding the next steps.\n`;
                     emailHtml += `<p>The shelter will contact you regarding the next steps.</p>`;
                 }
                 emailText += `\nYou can view your application status here: ${FRONTEND_URL}/dashboard`; // Link to user dashboard
                 emailHtml += `<p>You can view your application status <a href="${FRONTEND_URL}/dashboard">on your dashboard</a>.</p>`;


                await sendEmail({
                    to: applicant.email,
                    subject: subject,
                    text: emailText,
                    html: emailHtml,
                });
            } catch (emailError) {
                 console.error(`Failed to send application status update email to applicant ${applicant.id}:`, emailError);
                 // Don't fail the request if email fails
            }

            res.json(application); // Return updated application

        } catch (error) {
            console.error(`Error updating application status for ID ${id}:`, error);
            res.status(500).json({ message: 'Server error updating application status.' });
        }
    });


    module.exports = router;