const express = require('express');
const { createList, getLists, getListById, updateList, deleteList, followList, unfollowList } = require('../controllers/listController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a new list
router.post('/', authMiddleware, createList);

// Route to get all lists (or just public lists if user is not logged in)
router.get('/', getLists);

// Route to get a specific list by ID
router.get('/:listId', getListById);

// Route to update a list (only the creator can update)
router.put('/:listId', authMiddleware, updateList);

// Route to delete a list (only the creator can delete)
router.delete('/:listId', authMiddleware, deleteList);

// Route to follow a list
router.post('/:listId/follow', authMiddleware, followList);

// Route to unfollow a list
router.post('/:listId/unfollow', authMiddleware, unfollowList);

module.exports = router;
