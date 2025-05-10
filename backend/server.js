require('dotenv').config(); // Load environment variables

// Verify JWT_SECRET is loaded immediately
if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is missing in .env or dotenv failed.");
    process.exit(1);
}

const express = require('express');
const cors = require('cors');

// Import Models & Sequelize instance from index.js
const db = require('./models'); // This loads models and defines associations

// Import routes
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
// const shelterRoutes = require('./routes/shelters');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Basic Route
app.get('/', (req, res) => {
  res.send('Pet Adoption API Running');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
// app.use('/api/shelters', shelterRoutes);

// Database Connection and Server Start
db.sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully via models/index.js.');
    // Sync models (optional, consider migrations for production)
    // { alter: true } attempts to update tables without dropping them
    // { force: true } drops and recreates tables (DATA LOSS!)
    return db.sequelize.sync({ alter: true }); // Using alter for development convenience
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
