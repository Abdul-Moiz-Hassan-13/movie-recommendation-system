const Movie = require('../models/Movie');
const User = require('../models/User');
const paginate = require('../utils/paginate'); // Import paginate utility

// Get User Recommendations
exports.getUserRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId; // Retrieve userId from req.user as set by authMiddleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. Fetch user's favorite genres and recently watched movies
    const { favoriteGenres, watchedMovies } = user;

    // 2. Get genres from the user's most recently watched movies
    const recentMovies = await Movie.find({ _id: { $in: watchedMovies } })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentGenres = new Set();
    recentMovies.forEach(movie => {
      movie.genre.forEach(genre => recentGenres.add(genre));
    });

    // Combine favorite genres with genres from recently watched movies
    const genrePreferences = Array.from(new Set([...favoriteGenres, ...recentGenres]));

    // 3. Recommend movies in these genres that the user hasn't watched yet
    const query = Movie.find({
      genre: { $in: genrePreferences },
      _id: { $nin: watchedMovies }
    }).sort({ popularityScore: -1, averageRating: -1 });

    const { page = 1, limit = 10 } = req.query;
    const recommendations = await paginate(query, page, limit);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Similar Titles
exports.getSimilarTitles = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const query = Movie.find({
      _id: { $ne: movieId },
      $or: [
        { genre: { $in: movie.genre } },
        { director: movie.director }
      ]
    });

    const { page = 1, limit = 10 } = req.query;
    const similarMovies = await paginate(query, page, limit);

    res.json(similarMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Trending Movies
exports.getTrendingMovies = async (req, res) => {
  try {
    const query = Movie.find().sort({ popularityScore: -1 });

    const { page = 1, limit = 10 } = req.query;
    const trendingMovies = await paginate(query, page, limit);

    res.json(trendingMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Top-Rated Movies
exports.getTopRatedMovies = async (req, res) => {
  try {
    const query = Movie.find().sort({ averageRating: -1 });

    const { page = 1, limit = 10 } = req.query;
    const topRatedMovies = await paginate(query, page, limit);

    res.json(topRatedMovies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
