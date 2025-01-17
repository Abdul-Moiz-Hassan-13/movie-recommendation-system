const express = require('express');
const { deleteReview } = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { getSiteStatistics } = require('../controllers/adminController');

const router = express.Router();

// Delete a review
router.delete('/reviews/:movieId/:reviewId', authMiddleware, adminMiddleware, deleteReview);
// Get site statistics
router.get('/statistics', authMiddleware, adminMiddleware, getSiteStatistics);


module.exports = router;
