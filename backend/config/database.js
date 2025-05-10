const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // Ensure .env is loaded relative to server.js

const sequelize = new Sequelize(
  process.env.DB_NAME || 'petadopt', // Use DB_NAME from .env or default
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '@sHaikryan222', // Replace with your actual default if needed
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

module.exports = sequelize;