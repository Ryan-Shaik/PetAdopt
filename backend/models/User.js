const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

class User extends Model {
    // Method to check password validity
    async validPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('Adopter', 'Shelter', 'Admin'),
        allowNull: false,
        defaultValue: 'Adopter',
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    // Optional: Add fields for shelter details if role is 'Shelter'
    // shelterName: {
    //     type: DataTypes.STRING,
    //     allowNull: true, // Only required if role is Shelter
    // },
    // shelterAddress: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    // shelterStatus: { // e.g., Pending Approval, Approved
    //     type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
    //     allowNull: true, // Only relevant for Shelters
    //     defaultValue: 'Pending',
    // }
}, {
    sequelize,
    modelName: 'User',
    timestamps: true, // Adds createdAt and updatedAt fields
    hooks: {
        // Hash password before creating a user
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hash password before updating a user (if password changed)
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});



module.exports = User;
