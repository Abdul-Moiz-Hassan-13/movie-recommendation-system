const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mongoose = require('mongoose');
const paginate = require('../utils/paginate');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // User ID from JWT
    const updates = { ...req.body }; // Copy the updates from the request body

    // Check if the password is being updated
    if (updates.password) {
      // Hash the new password before saving it
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Update the user and return the updated user document
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
    try {
      const userId = req.user.userId;
      const movieId = req.body.movieId;
  
      // Convert movieId to ObjectId
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json({ error: 'Invalid movie ID format' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Ensure movieId is an ObjectId and check if it is already in the wishlist
      const objectId = new mongoose.Types.ObjectId(movieId); // Use 'new' with ObjectId
      if (!user.wishlist.includes(objectId)) {
        user.wishlist.push(objectId);
      }
      await user.save();
  
      res.json(user.wishlist);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getNonAdminUsers = async (req, res) => {
    try {
      // Ensure the requester is an admin
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Access denied: Admins only." });
      }
  
      // Extract pagination parameters
      const { page = 1, limit = 10 } = req.query;
  
      // Query for non-admin users
      const query = User.find({ isAdmin: false }).select('-password'); // Exclude password from the response
  
      // Apply pagination
      const paginatedUsers = await paginate(query, page, limit);
  
      res.json(paginatedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
