const express = require('express');
const {
  addNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const authMiddleware = require('../middlewares/authMiddleware'); // For authentication
const adminMiddleware = require('../middlewares/adminMiddleware'); // For admin-only actions

const router = express.Router();

// Add a news article (Admin only)
router.post('/', authMiddleware, adminMiddleware, addNews);

// Get all news articles
router.get('/', getNews);

// Get a single news article by ID
router.get('/:newsId', getNewsById);

// Update a news article (Admin only)
router.put('/:newsId', authMiddleware, adminMiddleware, updateNews);

// Delete a news article (Admin only)
router.delete('/:newsId', authMiddleware, adminMiddleware, deleteNews);

module.exports = router;
