const { DataTypes, Model } = require('sequelize');
        const sequelize = require('../config/database');
        const User = require('./User');
        const Pet = require('./Pet');

        class UserFavorite extends Model {}

        UserFavorite.init({
            userId: {
                type: DataTypes.INTEGER,
                references: { model: User, key: 'id' },
                primaryKey: true, // Part of composite key
                onDelete: 'CASCADE',
            },
            petId: {
                type: DataTypes.INTEGER,
                references: { model: Pet, key: 'id' },
                primaryKey: true, // Part of composite key
                onDelete: 'CASCADE',
            },
        }, {
            sequelize,
            modelName: 'UserFavorite',
            timestamps: true, // Add createdAt if needed
        });

        module.exports = UserFavorite;