const { DataTypes, Model } = require('sequelize');
    const sequelize = require('../config/database');
    // Models for associations will be required in models/index.js

    class Application extends Model {}

    Application.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        applicantId: { // Foreign Key to User (Applicant)
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        petId: { // Foreign Key to Pet
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        shelterId: { // Foreign Key to User (Shelter owning the pet)
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Withdrawn'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        applicantMessage: { // Reason for adoption, etc.
            type: DataTypes.TEXT,
            allowNull: true,
        },
        homeEnvironment: { // Description of home environment
            type: DataTypes.TEXT,
            allowNull: true, // Make required based on frontend form later
        },
        // applicationDate is handled by createdAt timestamp
        decisionDate: { // Date the shelter made a decision
            type: DataTypes.DATE,
            allowNull: true,
        },
        shelterNotes: { // Optional notes from shelter on decision
            type: DataTypes.TEXT,
            allowNull: true,
        },
        // TODO: Add more fields based on application form (e.g., phone, address - consider linking to User profile instead)
    }, {
        sequelize,
        modelName: 'Application',
        timestamps: true, // Adds createdAt (applicationDate) and updatedAt
    });

    module.exports = Application;