const List = require('../models/List');
const User = require('../models/User');
const paginate = require('../utils/paginate'); // Import the pagination utility

exports.createList = async (req, res) => {
    try {
      console.log("User ID from middleware:", req.user.userId); // Debug user ID
      const { title, description, movies, isPublic } = req.body;
      const list = new List({
        title,
        description,
        movies,
        creator: req.user.userId, // from authMiddleware
        isPublic,
      });
      await list.save();
      res.status(201).json({ message: 'List created successfully', list });
    } catch (error) {
      console.error("Error creating list:", error.message);
      res.status(500).json({ error: error.message });
    }
  };  

  exports.getLists = async (req, res) => {
    try {
      // Only show public lists if the user is not authenticated
      const filter = req.user ? {} : { isPublic: true };
  
      // Build the query
      const query = List.find(filter).populate('movies').populate('creator', 'username');
  
      // Extract pagination parameters
      const { page = 1, limit = 10 } = req.query;
  
      // Use the paginate utility to handle pagination
      const paginatedLists = await paginate(query, parseInt(page), parseInt(limit));
  
      res.json(paginatedLists); // Send the paginated response
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

exports.getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.listId).populate('movies').populate('creator', 'username');
    if (!list || (!list.isPublic && (!req.user || req.user.userId.toString() !== list.creator.toString()))) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }
    res.json({ list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { listId } = req.params;
    const updates = req.body;
    const list = await List.findOneAndUpdate(
      { _id: listId, creator: req.user.userId }, // Only allow creator to update
      updates,
      { new: true }
    );
    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }
    res.json({ message: 'List updated successfully', list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { listId } = req.params;
    const list = await List.findOneAndDelete({ _id: listId, creator: req.user.userId }); // Only allow creator to delete
    if (!list) {
      return res.status(404).json({ error: 'List not found or access denied' });
    }
    res.json({ message: 'List deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.followList = async (req, res) => {
  try {
    const { listId } = req.params;
    const list = await List.findById(listId);
    if (!list) return res.status(404).json({ error: 'List not found' });
    if (list.followers.includes(req.user.userId)) {
      return res.status(400).json({ error: 'Already following this list' });
    }
    list.followers.push(req.user.userId);
    await list.save();
    res.json({ message: 'List followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unfollowList = async (req, res) => {
    try {
      const { listId } = req.params;
      console.log("List ID:", listId); // Debug: Check list ID
      console.log("User ID from req.user:", req.user.userId); // Debug: Check user ID
  
      const list = await List.findById(listId);
      if (!list) return res.status(404).json({ error: 'List not found' });
  
      console.log("Current Followers:", list.followers); // Debug: Check current followers
  
      // Filter out the user ID from the followers list
      list.followers = list.followers.filter(userId => userId.toString() !== req.user.userId.toString());
  
      console.log("Updated Followers after Unfollow:", list.followers); // Debug: Check updated followers
  
      await list.save();
      res.json({ message: 'Unfollowed the list successfully' });
    } catch (error) {
      console.error("Error in unfollowList:", error.message); // Debug error details
      res.status(500).json({ error: error.message });
    }
  };
  
