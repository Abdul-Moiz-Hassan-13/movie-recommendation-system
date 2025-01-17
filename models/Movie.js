const mongoose = require('mongoose');

// Schema for Box Office Information
const boxOfficeSchema = new mongoose.Schema({
  openingWeekend: { type: Number, default: 0 },
  domestic: { type: Number, default: 0 },
  international: { type: Number, default: 0 },
  worldwide: { type: Number, default: 0 }
});

// Schema for Awards
const awardSchema = new mongoose.Schema({
  awardName: { type: String, required: true },
  category: { type: String, required: true },
  year: { type: Number, required: true },
  won: { type: Boolean, required: true }
});

// Schema for Reviews (Embedded in Movie Schema)
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Main Movie Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  director: { type: String, required: true },
  cast: [String],
  releaseDate: Date,
  runtime: Number,
  synopsis: String,
  averageRating: { type: Number, default: 0 },
  boxOffice: boxOfficeSchema,
  awards: [awardSchema],
  reviews: [reviewSchema], // Embedded reviews
  coverPhoto: String,
  popularityScore: { type: Number, default: 0 },
  country: String,
  language: String
}, { timestamps: true });

// Full-Text Index for Search
movieSchema.index({ title: 'text', synopsis: 'text', trivia: 'text' }, { default_language: 'none' });

// Calculate Average Rating
movieSchema.methods.calculateAverageRating = function () {
  if (!this.reviews || this.reviews.length === 0) {
    return 0;
  }
  const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / this.reviews.length;
};

// Pre-Save Hook for Automatic Average Rating Calculation
movieSchema.pre('save', function (next) {
  // Update averageRating without calling this.save()
  this.averageRating = this.calculateAverageRating();
  next();
});

module.exports = mongoose.model('Movie', movieSchema);
