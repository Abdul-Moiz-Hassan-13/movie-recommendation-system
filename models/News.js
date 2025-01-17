const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },             // Title of the article
  content: { type: String, required: true },           // Main content of the article
  category: { type: String, enum: ['Movies', 'Actors', 'Projects', 'Industry'], required: true }, // Article category
  author: { type: String, required: true },            // Author of the article
  tags: [String],                                      // Tags for filtering
  image: { type: String },                             // Optional: Image URL
  createdAt: { type: Date, default: Date.now },        // Creation timestamp
  updatedAt: { type: Date, default: Date.now }         // Update timestamp
});

module.exports = mongoose.model('News', newsSchema);
