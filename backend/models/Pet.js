const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
// User model will be required later for associations

    class Pet extends Model {}

    Pet.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        species: {
            type: DataTypes.STRING, // e.g., 'Dog', 'Cat', 'Rabbit'
            allowNull: false,
        },
        breed: {
            type: DataTypes.STRING,
            allowNull: true, // Breed might not always be known
        },
        age: {
            type: DataTypes.STRING, // e.g., 'Puppy', 'Young', 'Adult', 'Senior'
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Unknown'),
            allowNull: true,
        },
        size: {
            type: DataTypes.ENUM('Small', 'Medium', 'Large', 'X-Large'),
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        medicalHistory: {
            type: DataTypes.TEXT, // Store vaccination info, spay/neuter status, etc.
            allowNull: true,
        },
        adoptionStatus: {
            type: DataTypes.ENUM('Available', 'Pending', 'Adopted'),
            allowNull: false,
            defaultValue: 'Available',
        },
        imageUrl: {
            type: DataTypes.STRING, // Store URL of the primary image
            allowNull: true, // Allow pets without images initially
            validate: {
                isUrl: true, // Basic validation if URL is provided
            }
        },
        // Foreign Key to link to the User (Shelter)
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            // Foreign key relationship is handled by the Pet.belongsTo association
        },
        // TODO: Consider adding fields for multiple images (e.g., JSON type or separate Image model)
        // TODO: Consider adding location field if not derived from shelter user
    }, {
        sequelize,
        modelName: 'Pet',
        timestamps: true, // Adds createdAt and updatedAt
    });

    
    module.exports = Pet;
