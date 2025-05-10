const fs = require('fs');
        const path = require('path');
        const Sequelize = require('sequelize');
        const sequelize = require('../config/database'); // Your configured sequelize instance

        const db = {};
        const basename = path.basename(__filename);

        // Read all files in the current directory (models)
        fs.readdirSync(__dirname)
          .filter(file => {
            // Filter out non-JS files, the index file itself, and test files
            return (
              file.indexOf('.') !== 0 &&
              file !== basename &&
              file.slice(-3) === '.js' &&
              file.indexOf('.test.js') === -1
            );
          })
          .forEach(file => {
            // Import the model definition function/class
            // Adjust based on how your models export (module.exports = ModelClass vs module.exports = (sequelize, DataTypes) => { ... })
            // Assuming module.exports = ModelClass
            const model = require(path.join(__dirname, file));
            if (model && model.prototype instanceof Sequelize.Model) {
                 // Check if it's a Sequelize model before adding
                 db[model.name] = model;
                 console.log(`Loaded model: ${model.name}`);
            } else {
                 console.warn(`File ${file} does not export a Sequelize model.`);
            }
          });

        // --- Define Associations ---
        // Ensure models exist before defining associations
        if (db.User && db.Pet && db.UserFavorite && db.Application) {
            console.log('Defining associations...');

            // User <-> Pet (Shelter listing)
            db.User.hasMany(db.Pet, { foreignKey: 'userId' }); // A User (Shelter) has many Pets
            db.Pet.belongsTo(db.User, { foreignKey: 'userId', as: 'shelter' }); // A Pet belongs to a User (Shelter)

            // User <-> Pet (Favorites - Many-to-Many)
            db.User.belongsToMany(db.Pet, { through: db.UserFavorite, as: 'Favorites', foreignKey: 'userId' });
            db.Pet.belongsToMany(db.User, { through: db.UserFavorite, as: 'FavoritedBy', foreignKey: 'petId' });

            // Application Associations
            // Application -> User (Applicant)
            db.Application.belongsTo(db.User, { as: 'applicant', foreignKey: 'applicantId' });
            db.User.hasMany(db.Application, { as: 'submittedApplications', foreignKey: 'applicantId' });
            
            // Application -> Pet
            db.Application.belongsTo(db.Pet, { foreignKey: 'petId' });
            db.Pet.hasMany(db.Application, { foreignKey: 'petId' });
            
            // Application -> User (Shelter)
            db.Application.belongsTo(db.User, { as: 'shelter', foreignKey: 'shelterId' });

            console.log('Associations defined.');
        } else {
             console.error('One or more models failed to load, cannot define associations.');
             // Log which models are missing
             if (!db.User) console.error('Model User is missing.');
             if (!db.Pet) console.error('Model Pet is missing.');
             if (!db.UserFavorite) console.error('Model UserFavorite is missing.');
             if (!db.Application) console.error('Model Application is missing.');
        }


        // Attach sequelize instance and Sequelize library to the db object
        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

        module.exports = db; // Export the db object containing models and sequelize
