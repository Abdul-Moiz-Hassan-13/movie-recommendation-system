const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional: Track which user made the search
  searchQuery: { type: String, required: true }, // The search term
  category: { type: String, enum: ['Actor', 'Movie', 'Genre'], required: true }, // Type of search
  createdAt: { type: Date, default: Date.now }, // Timestamp of the search
});

module.exports = mongoose.model('SearchLog', searchLogSchema);
