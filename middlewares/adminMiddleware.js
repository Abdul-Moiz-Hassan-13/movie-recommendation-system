// middlewares/adminMiddleware.js
const User = require('../models/User'); // Import the User model to check admin status

const adminMiddleware = async (req, res, next) => {
  try {
    // Find the user by the ID stored in the request (from JWT)
    const user = await User.findById(req.user.userId);
    if (!user || !user.isAdmin) {
      // If the user does not exist or is not an admin, deny access
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    // If the user is an admin, allow the request to continue
    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = adminMiddleware;
