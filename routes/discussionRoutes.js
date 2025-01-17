const express = require('express');
const {
    createDiscussion,
    getDiscussions,
    getDiscussionById,
    createReply,
    likeDiscussion,
    dislikeDiscussion,
    deleteDiscussion, 
    deleteReply
  } = require('../controllers/discussionController');  
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Discussion Routes
router.post('/', authMiddleware, createDiscussion); // Create a discussion
router.get('/', getDiscussions); // Get all discussions with optional filters
router.get('/:discussionId', getDiscussionById); // Get a single discussion

// Reply Routes
router.post('/:discussionId/replies', authMiddleware, createReply); // Add a reply to a discussion
router.post('/:discussionId/like', authMiddleware, likeDiscussion); // Like a discussion
router.post('/:discussionId/dislike', authMiddleware, dislikeDiscussion); // Dislike a discussion
// Delete a Discussion (Admin or Owner Only)
router.delete('/:discussionId', authMiddleware, deleteDiscussion);

// Delete a Reply (Owner Only)
router.delete('/:discussionId/replies/:replyId', authMiddleware, deleteReply);

module.exports = router;
