const Movie = require('../models/Movie');
const User = require('../models/User');
const SearchLog = require('../models/SearchLog');
const paginate = require('../utils/paginate'); // Ensure the paginate function is imported

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
      const { movieId, reviewId } = req.params;
  
      // Find the movie
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
  
      // Find the review
      const review = movie.reviews.id(reviewId);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
  
      // Remove the review from the reviews array
      movie.reviews.pull(review._id);
      await movie.save();
  
      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };  

  exports.getSiteStatistics = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Extract page and limit from query params
  
      // Most popular movies with pagination
      const popularMoviesQuery = Movie.find().sort({ popularityScore: -1 }).select('title popularityScore');
      const mostPopularMovies = await paginate(popularMoviesQuery, page, limit);
  
      // Trending genres (not paginated as it’s an aggregation)
      const genres = await Movie.aggregate([
        { $unwind: '$genre' },
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);
  
      // Most searched actors (manual pagination as it's an aggregation)
      const actorsQuery = SearchLog.aggregate([
        { $match: { category: 'Actor' } }, // Only consider actor searches
        { $group: { _id: '$searchQuery', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      const skip = (page - 1) * limit;
      const mostSearchedActors = await actorsQuery.skip(skip).limit(limit);
  
      // Recently active users with pagination
      const usersQuery = User.find().sort({ updatedAt: -1 }).select('username email updatedAt');
      const recentUsers = await paginate(usersQuery, page, limit);
  
      res.json({
        mostPopularMovies,
        trendingGenres: genres.map(genre => ({ genre: genre._id, count: genre.count })),
        mostSearchedActors: {
          total: mostSearchedActors.length,
          page,
          pageSize: mostSearchedActors.length,
          data: mostSearchedActors.map(actor => ({
            name: actor._id,
            searches: actor.count,
          })),
        },
        recentUsers,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
