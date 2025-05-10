const express = require('express');
        const authMiddleware = require('../middleware/authMiddleware');
        const User = require('../models/User');
        const Pet = require('../models/Pet'); // Required for eager loading

        const router = express.Router();

        // --- GET Current User's Favorites ---
        router.get('/me/favorites', authMiddleware, async (req, res) => {
            try {
                const user = await User.findByPk(req.user.id);
                if (!user) return res.status(404).json({ message: 'User not found' });

                // Use the association method to get favorite pets
                const favorites = await user.getFavorites({ // 'getFavorites' uses the 'as: Favorites' alias
                    // Optionally include details about the pet
                     include: [{ model: User, as: 'shelter', attributes: ['id', 'name'] }], // Include shelter info
                     attributes: { exclude: ['userId'] } // Exclude redundant userId from Pet object
                });

                res.json(favorites);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                res.status(500).json({ message: 'Server error fetching favorites.' });
            }
        });

        // --- ADD a Pet to Favorites ---
        router.post('/me/favorites/:petId', authMiddleware, async (req, res) => {
            const { petId } = req.params;
            try {
                const user = await User.findByPk(req.user.id);
                const pet = await Pet.findByPk(petId);

                if (!user) return res.status(404).json({ message: 'User not found' });
                if (!pet) return res.status(404).json({ message: 'Pet not found' });

                // Use association method to add favorite
                await user.addFavorite(pet); // 'addFavorite' uses the 'as: Favorites' alias

                res.status(200).json({ message: 'Pet added to favorites.' });
            } catch (error) {
                 // Handle potential unique constraint errors if already favorited (depends on DB)
                if (error.name === 'SequelizeUniqueConstraintError') {
                     return res.status(409).json({ message: 'Pet already in favorites.' });
                }
                console.error('Error adding favorite:', error);
                res.status(500).json({ message: 'Server error adding favorite.' });
            }
        });

        // --- REMOVE a Pet from Favorites ---
        router.delete('/me/favorites/:petId', authMiddleware, async (req, res) => {
            const { petId } = req.params;
            try {
                const user = await User.findByPk(req.user.id);
                const pet = await Pet.findByPk(petId);

                if (!user) return res.status(404).json({ message: 'User not found' });
                if (!pet) return res.status(404).json({ message: 'Pet not found' });

                // Use association method to remove favorite
                const result = await user.removeFavorite(pet); // 'removeFavorite' uses the 'as: Favorites' alias

                if (result === 0) {
                    // If result is 0, the association didn't exist
                    return res.status(404).json({ message: 'Pet not found in favorites.' });
                }

                res.status(200).json({ message: 'Pet removed from favorites.' });
            } catch (error) {
                console.error('Error removing favorite:', error);
                res.status(500).json({ message: 'Server error removing favorite.' });
            }
        });

        // --- UPDATE Current User's Profile (Name, Phone, Address ONLY) ---
        router.put('/me', authMiddleware, async (req, res) => {
            const userId = req.user.id;
            // Only accept these fields for update
            const { name, phoneNumber, address } = req.body;

            try {
                const user = await User.findByPk(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }

                // --- Update Fields ---
                // Update only if a value is provided in the request body
                if (name !== undefined) {
                    user.name = name.trim() || user.name; // Keep old name if empty string sent
                }
                if (phoneNumber !== undefined) {
                    user.phoneNumber = phoneNumber; // Allow empty string to clear phone
                }
                if (address !== undefined) {
                    user.address = address; // Allow empty string to clear address
                }

                // Save changes
                await user.save();

                // Return updated user data (excluding sensitive fields)
                const updatedUserData = user.toJSON();
                delete updatedUserData.password;
                delete updatedUserData.resetPasswordToken;
                delete updatedUserData.resetPasswordExpires;
                
                res.json(updatedUserData);

            } catch (error) {
                console.error('Error updating user profile:', error);
                res.status(500).json({ message: 'Server error updating profile.' });
            }
        });

        module.exports = router;
