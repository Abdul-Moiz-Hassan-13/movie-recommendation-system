// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteGenres: [String],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  isAdmin: { type: Boolean, default: false },
  watchedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }], // Movies watched by user
  ratings: [{
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    rating: { type: Number, min: 1, max: 5 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
