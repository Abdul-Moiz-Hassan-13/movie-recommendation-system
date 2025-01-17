const Discussion = require('../models/Discussion');
const Reply = require('../models/Reply');
const paginate = require('../utils/paginate'); // Import the pagination utility

// Create Discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { category, title, content } = req.body;
    const discussion = new Discussion({
      category,
      title,
      content,
      createdBy: req.user.userId, // Extracted from authMiddleware
    });
    await discussion.save();
    res.status(201).json({ message: 'Discussion created successfully', discussion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Discussions
exports.getDiscussions = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query; // Extract query params
    const filter = {};
    if (category) filter.category = category; // Filter by category if provided
    if (search) filter.title = { $regex: search, $options: 'i' }; // Filter by search term

    const query = Discussion.find(filter).populate('createdBy', 'username'); // Build the query with filters and population

    // Use the paginate utility to handle pagination
    const discussions = await paginate(query, parseInt(page), parseInt(limit));

    res.json(discussions); // Send the paginated response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Discussion
exports.getDiscussionById = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const discussion = await Discussion.findById(discussionId).populate('createdBy', 'username');
    if (!discussion) return res.status(404).json({ error: 'Discussion not found' });

    res.json({ discussion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Reply
exports.createReply = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { content, parentReply } = req.body;

    const reply = new Reply({
      discussion: discussionId,
      content,
      parentReply: parentReply || null,
      createdBy: req.user.userId,
    });
    await reply.save();

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ error: 'Discussion not found' });
    discussion.replies.push(reply._id);
    await discussion.save();

    res.status(201).json({ message: 'Reply added successfully', reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like a Discussion
exports.likeDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user.userId;

    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ error: 'Discussion not found' });

    if (!discussion.likes.includes(userId)) {
      discussion.likes.push(userId);
      discussion.dislikes = discussion.dislikes.filter(id => id.toString() !== userId);
      await discussion.save();
    }

    res.json({ message: 'Liked the discussion', likes: discussion.likes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dislike a Discussion
exports.dislikeDiscussion = async (req, res) => {
    try {
      const { discussionId } = req.params;
      const userId = req.user.userId;
  
      const discussion = await Discussion.findById(discussionId);
      if (!discussion) return res.status(404).json({ error: 'Discussion not found' });
  
      if (!discussion.dislikes.includes(userId)) {
        discussion.dislikes.push(userId);
        discussion.likes = discussion.likes.filter(id => id.toString() !== userId);
        await discussion.save();
      }
  
      res.json({ message: 'Disliked the discussion', dislikes: discussion.dislikes.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Delete a Discussion
exports.deleteDiscussion = async (req, res) => {
    try {
      const { discussionId } = req.params;
  
      // Find the discussion by ID
      const discussion = await Discussion.findById(discussionId);
      if (!discussion) {
        return res.status(404).json({ error: 'Discussion not found' });
      }
  
      // Check if the user is the creator or an admin
      if (
        discussion.createdBy.toString() !== req.user.userId.toString() &&
        !req.user.isAdmin
      ) {
        return res
          .status(403)
          .json({ error: 'You do not have permission to delete this discussion' });
      }
  
      // Delete the discussion (triggers pre-remove middleware to delete replies)
      await discussion.deleteOne();
  
      res.json({ message: 'Discussion and its replies deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a Reply
exports.deleteReply = async (req, res) => {
    try {
      const { replyId } = req.params;
  
      // Find and delete the reply
      const reply = await Reply.findByIdAndDelete(replyId);
      if (!reply) {
        return res.status(404).json({ error: 'Reply not found' });
      }
  
      // Remove the reply reference from the discussion
      const discussion = await Discussion.findById(reply.discussion);
      if (discussion) {
        discussion.replies = discussion.replies.filter(
          id => id.toString() !== replyId
        );
        await discussion.save();
      }
  
      res.json({ message: 'Reply deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  