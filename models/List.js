const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // References to movies in the list
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the list
  isPublic: { type: Boolean, default: false }, // If true, the list can be shared with others
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who follow this list
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);
