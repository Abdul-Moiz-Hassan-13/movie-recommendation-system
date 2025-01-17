// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Authorization token:", token); // Debug: Check token extraction
    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Debug: Check decoded token
    const userId = decoded.userId;
    console.log("Decoded user ID:", userId); // Debug: Check if userId is present

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Attach user information to req.user
    req.user = {
      userId: user._id,
      isAdmin: user.isAdmin
    };
    console.log("User information attached to req.user:", req.user); // Debug: Check req.user object

    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error.message); // Debug error details
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
