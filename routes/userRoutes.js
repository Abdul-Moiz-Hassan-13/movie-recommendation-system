// routes/userRoutes.js
const express = require('express');
const { getNonAdminUsers } = require('../controllers/userController'); // Import the function
const { updateProfile, addToWishlist } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');
const router = express.Router();

router.get('/non-admins', authMiddleware, getNonAdminUsers);
router.put('/profile', authMiddleware, updateProfile);
router.post('/wishlist', authMiddleware, addToWishlist);

module.exports = router;