// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }, // Optional: Notify for a specific movie
  genre: { type: String }, // Optional: Notify for a genre
  notificationType: { type: String, enum: ['email', 'dashboard'], default: 'email' }, // Notification preference
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
