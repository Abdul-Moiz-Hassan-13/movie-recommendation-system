const express = require('express');
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose'); // Database connection
const swaggerUi = require('swagger-ui-express'); // API documentation
const swaggerDocument = require('./swagger.json'); // Swagger configuration
const connectDB = require('./config/db'); // MongoDB connection setup

// Commonly used packages for other modules
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For authentication tokens
const nodemailer = require('nodemailer'); // For email notifications

// Import route modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const crewRoutes = require('./routes/crewRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const listRoutes = require('./routes/listRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const newsRoutes = require('./routes/newsRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import the admin routes

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/admin', adminRoutes); // Add admin routes here

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // Optional: Export for testing or other uses
