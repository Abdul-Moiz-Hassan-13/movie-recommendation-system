// controllers/reviewController.js
const Movie = require('../models/Movie');
const paginate = require('../utils/paginate'); // Import the paginate utility

exports.addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const movieId = req.params.movieId;
    const userId = req.user.userId; // Assumes user ID is available in req.user

    // Find movie and add the review
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Check if user already reviewed this movie
    const existingReview = movie.reviews.find(review => review.user.toString() === userId);
    if (existingReview) return res.status(400).json({ message: 'User has already reviewed this movie' });

    const newReview = {
      user: userId,
      rating,
      reviewText
    };

    movie.reviews.push(newReview);
    
    // Update the movie's average rating
    movie.averageRating = calculateAverageRating(movie.reviews);

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to calculate average rating
const calculateAverageRating = (reviews) => {
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1); // Limit to 1 decimal place
};

exports.updateReview = async (req, res) => {
    try {
      const { rating, reviewText } = req.body;
      const movieId = req.params.movieId;
      const userId = req.user.userId;
  
      const movie = await Movie.findById(movieId);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
  
      // Find the review by the user
      const review = movie.reviews.find(review => review.user.toString() === userId);
      if (!review) return res.status(404).json({ message: 'Review not found' });
  
      // Update review details
      review.rating = rating;
      review.reviewText = reviewText;
      review.updatedAt = Date.now();
  
      // Update the average rating
      movie.averageRating = calculateAverageRating(movie.reviews);
  
      await movie.save();
      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get all reviews for a movie with pagination
  exports.getReviews = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Pagination parameters
  
      const movie = await Movie.findById(req.params.movieId).populate('reviews.user', 'username'); // Populate reviewer's username
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
  
      // Paginate the reviews
      const query = Movie.findById(req.params.movieId).select('reviews'); // Use only the reviews field
      const paginatedReviews = await paginate(query, page, limit);
  
      res.json(paginatedReviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Get review highlights (top-rated and most-discussed) with pagination
  exports.getReviewHighlights = async (req, res) => {
    try {
      const { page = 1, limit = 3 } = req.query; // Pagination parameters for highlights
  
      const movie = await Movie.findById(req.params.movieId);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
  
      // Sort reviews by rating and most recent
      const topRatedReviews = [...movie.reviews]
        .sort((a, b) => b.rating - a.rating); // Sorted by rating descending
  
      const mostDiscussedReviews = [...movie.reviews]
        .sort((a, b) => b.createdAt - a.createdAt); // Sorted by creation date descending
  
      // Paginate the sorted reviews
      const topRatedPage = (page - 1) * limit;
      const paginatedTopRated = topRatedReviews.slice(topRatedPage, topRatedPage + limit);
  
      const mostDiscussedPage = (page - 1) * limit;
      const paginatedMostDiscussed = mostDiscussedReviews.slice(mostDiscussedPage, mostDiscussedPage + limit);
  
      res.json({
        topRated: paginatedTopRated,
        mostDiscussed: paginatedMostDiscussed,
        page,
        limit
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

exports.deleteReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.userId; // Assuming user ID is available from authMiddleware

    // Find the movie and review
    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    // Find the review index
    const reviewIndex = movie.reviews.findIndex(review => review.user.toString() === userId);
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found or not authorized to delete' });

    // Remove the review
    movie.reviews.splice(reviewIndex, 1);

    // Update average rating after review deletion
    const totalRating = movie.reviews.reduce((sum, review) => sum + review.rating, 0);
    movie.averageRating = movie.reviews.length ? (totalRating / movie.reviews.length).toFixed(1) : 0;

    await movie.save();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  