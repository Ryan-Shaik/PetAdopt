const express = require('express');
    const Pet = require('../models/Pet');
    const User = require('../models/User'); // Needed for eager loading shelter info
    const authMiddleware = require('../middleware/authMiddleware'); // Middleware to check authentication
    const { Op } = require('sequelize'); // Import Op for Sequelize operators

    const router = express.Router();

    // --- Helper Function to Check Role ---
    const isShelter = (req, res, next) => {
        if (req.user && req.user.role === 'Shelter') {
            next(); // User is a shelter, proceed
        } else {
            res.status(403).json({ message: 'Access denied. Shelter role required.' });
        }
    };

    // --- CREATE: Add a new Pet (Shelter only) ---
    router.post('/', authMiddleware, isShelter, async (req, res) => {
        const { name, species, breed, age, gender, size, description, medicalHistory, adoptionStatus, imageUrl } = req.body;
        const shelterUserId = req.user.id; // Get shelter ID from authenticated user

        // Basic validation
        if (!name || !species) {
            return res.status(400).json({ message: 'Pet name and species are required.' });
        }

        try {
            const newPet = await Pet.create({
                name,
                species,
                breed,
                age,
                gender,
                size,
                description,
                medicalHistory,
                adoptionStatus: adoptionStatus || 'Available', // Default if not provided
                imageUrl,
                userId: shelterUserId, // Associate pet with the logged-in shelter
            });
            console.log(`Pet created: ID ${newPet.id} by Shelter ID ${shelterUserId}`);
            res.status(201).json(newPet);
        } catch (error) {
            console.error('Error creating pet:', error);
            if (error.name === 'SequelizeValidationError') {
                 return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
            }
            res.status(500).json({ message: 'Server error creating pet.' });
        }
    });

    // --- READ: Get ALL Pets (Public, with filtering, excluding adopted pets) ---
    router.get('/', async (req, res) => {
        try {
            const { species, age, size, location } = req.query;

            const whereClause = {
                adoptionStatus: { [Op.ne]: 'Adopted' } // Exclude 'Adopted' pets
            };

            // Apply filters if provided
            if (species && species !== 'Any') {
                whereClause.species = species;
            }
            if (age && age !== 'Any') {
                whereClause.age = age;
            }
            if (size && size !== 'Any') {
                whereClause.size = size;
            }
            if (location && location.trim() !== '') {
                // Assuming location is stored as zipCode in the database
                whereClause.zipCode = location.trim();
                // For partial zip matches, you could use:
                // whereClause.zipCode = { [Op.like]: `${location.trim()}%` };
            }

            const pets = await Pet.findAll({
                where: whereClause,
                include: {
                    model: User,
                    as: 'shelter',
                    attributes: ['id', 'name']
                },
                order: [['createdAt', 'DESC']]
            });
            res.json(pets);
        } catch (error) {
            console.error('Error fetching filtered pets:', error);
            res.status(500).json({ message: 'Server error fetching pets.' });
        }
    });

    // --- READ: Get Pets for the Logged-in Shelter ---
    router.get('/my-pets', authMiddleware, isShelter, async (req, res) => {
        const shelterUserId = req.user.id;
        try {
            const shelterPets = await Pet.findAll({
                where: { userId: shelterUserId },
                order: [['createdAt', 'DESC']]
            });
            res.json(shelterPets);
        } catch (error) {
            console.error(`Error fetching pets for shelter ID ${shelterUserId}:`, error);
            res.status(500).json({ message: 'Server error fetching your pets.' });
        }
    });


    // --- READ: Get a Single Pet by ID (Public) ---
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const pet = await Pet.findByPk(id, {
                 include: {
                    model: User,
                    as: 'shelter',
                    attributes: ['id', 'name'] // Include shelter ID and name
                }
            });
            if (!pet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }
            res.json(pet);
        } catch (error) {
            console.error(`Error fetching pet ID ${id}:`, error);
            res.status(500).json({ message: 'Server error fetching pet details.' });
        }
    });

    // --- UPDATE: Modify a Pet (Shelter only, Own Pet only) ---
    router.put('/:id', authMiddleware, isShelter, async (req, res) => {
        const { id } = req.params;
        const shelterUserId = req.user.id;
        const updateData = req.body; // Contains fields to update

        // Prevent changing the userId
        delete updateData.userId;

        try {
            const pet = await Pet.findByPk(id);

            if (!pet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }

            // --- Ownership Check ---
            if (pet.userId !== shelterUserId) {
                console.warn(`Shelter ID ${shelterUserId} attempted to update Pet ID ${id} owned by User ID ${pet.userId}`);
                return res.status(403).json({ message: 'Access denied. You can only update your own pet listings.' });
            }

            // Update the pet
            const updatedPet = await pet.update(updateData);
            console.log(`Pet ID ${id} updated by Shelter ID ${shelterUserId}`);
            res.json(updatedPet);

        } catch (error) {
            console.error(`Error updating pet ID ${id}:`, error);
             if (error.name === 'SequelizeValidationError') {
                 return res.status(400).json({ message: error.errors.map(e => e.message).join(', ') });
            }
            res.status(500).json({ message: 'Server error updating pet.' });
        }
    });

    // --- DELETE: Remove a Pet (Shelter only, Own Pet only) ---
    router.delete('/:id', authMiddleware, isShelter, async (req, res) => {
        const { id } = req.params;
        const shelterUserId = req.user.id;

        try {
            const pet = await Pet.findByPk(id);

            if (!pet) {
                return res.status(404).json({ message: 'Pet not found.' });
            }

            // --- Ownership Check ---
            if (pet.userId !== shelterUserId) {
                 console.warn(`Shelter ID ${shelterUserId} attempted to delete Pet ID ${id} owned by User ID ${pet.userId}`);
                return res.status(403).json({ message: 'Access denied. You can only delete your own pet listings.' });
            }

            // Delete the pet
            await pet.destroy();
            console.log(`Pet ID ${id} deleted by Shelter ID ${shelterUserId}`);
            res.status(200).json({ message: 'Pet deleted successfully.' }); // Or 204 No Content

        } catch (error) {
            console.error(`Error deleting pet ID ${id}:`, error);
            res.status(500).json({ message: 'Server error deleting pet.' });
        }
    });


    module.exports = router;
