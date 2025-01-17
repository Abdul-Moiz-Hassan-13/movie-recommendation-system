// routes/reviewRoutes.js
const express = require('express');
const {
  addReview,
  updateReview,
  getReviews,
  getReviewHighlights,
  deleteReview // Import deleteReview controller function
} = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware'); // Only need authMiddleware, not adminMiddleware

const router = express.Router();

router.post('/:movieId', authMiddleware, addReview); // Allow any authenticated user to add a review
router.put('/:movieId', authMiddleware, updateReview); // Allow any authenticated user to update their review
router.get('/:movieId', getReviews); // Public route to get all reviews for a movie
router.get('/:movieId/highlights', getReviewHighlights); // Public route to get review highlights
router.delete('/:movieId', authMiddleware, deleteReview); // Allow the user to delete their own review

module.exports = router;
