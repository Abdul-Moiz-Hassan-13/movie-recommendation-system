// routes/subscriptionRoutes.js
const express = require('express');
const { createSubscription, getUserSubscriptions } = require('../controllers/subscriptionController');
const { notifySubscribers } = require('../controllers/subscriptionController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a subscription
router.post('/', authMiddleware, createSubscription);

// Get user subscriptions
router.get('/', authMiddleware, getUserSubscriptions);

router.post('/notify/:movieId', authMiddleware, notifySubscribers);

module.exports = router;
