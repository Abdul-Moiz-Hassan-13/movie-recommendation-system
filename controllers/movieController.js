const Movie = require('../models/Movie');
const SearchLog = require('../models/SearchLog'); // Import the SearchLog model
const paginate = require('../utils/paginate'); // Import the pagination utility
const Crew = require('../models/Crew'); // Import Crew model

exports.getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Extract pagination parameters

    // Use the paginate utility
    const query = Movie.find(); // Query to fetch all movies
    const paginatedMovies = await paginate(query, parseInt(page), parseInt(limit));

    res.json(paginatedMovies); // Send the paginated response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const { title } = req.body;
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({ error: 'Movie with this title already exists' });
    }

    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const updatedMovie = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    await Movie.findByIdAndDelete(movieId);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    // Check if there's a search query provided
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Pagination calculation
    const skip = (page - 1) * limit;

    // Search logic: using text search or regex
    const movies = await Movie.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        { director: { $regex: query, $options: "i" } },
        { cast: { $regex: query, $options: "i" } }
      ]
    })
      .skip(skip)
      .limit(parseInt(limit));

    const totalMovies = await Movie.countDocuments({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { genre: { $regex: query, $options: "i" } },
        { director: { $regex: query, $options: "i" } },
        { cast: { $regex: query, $options: "i" } }
      ]
    });

    // Log searches if they appear actor-related (matching the 'cast' field)
    const actorMatches = await Crew.find({
      name: { $regex: query, $options: "i" },
      role: "Actor"
    });

    if (actorMatches.length > 0) {
      await SearchLog.create({
        searchQuery: query,
        category: "Actor",
        user: req.user ? req.user.userId : null // Log user if authenticated
      });
    }

    res.json({
      movies: {
        data: movies,
        currentPage: page,
        totalPages: Math.ceil(totalMovies / limit),
      },
      actors: actorMatches, // Include actor matches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterByRating = async (req, res) => {
  try {
    const { minRating, maxRating, page = 1, limit = 10 } = req.query;

    // Build the filter for rating
    let filter = {};
    if (minRating || maxRating) {
      filter.averageRating = {};
      if (minRating) filter.averageRating.$gte = parseFloat(minRating);
      if (maxRating) filter.averageRating.$lte = parseFloat(maxRating);
    }

    // Use the paginate utility
    const query = Movie.find(filter);
    const paginatedResults = await paginate(query, page, limit);

    res.json(paginatedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterByPopularity = async (req, res) => {
  try {
    const { minPopularity, maxPopularity, page = 1, limit = 10 } = req.query;

    // Build the filter for popularity
    let filter = {};
    if (minPopularity || maxPopularity) {
      filter.popularityScore = {};
      if (minPopularity) filter.popularityScore.$gte = parseInt(minPopularity);
      if (maxPopularity) filter.popularityScore.$lte = parseInt(maxPopularity);
    }

    // Use the paginate utility
    const query = Movie.find(filter);
    const result = await paginate(query, page, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.filterByReleaseYear = async (req, res) => {
  try {
    const { releaseYear, page = 1, limit = 10 } = req.query;

    if (!releaseYear) {
      return res.status(400).json({ error: "Release year is required" });
    }

    // Build the filter for release year
    const startOfYear = new Date(`${releaseYear}-01-01`);
    const endOfYear = new Date(`${releaseYear}-12-31`);
    const filter = { releaseDate: { $gte: startOfYear, $lte: endOfYear } };

    // Use the paginate utility
    const query = Movie.find(filter);
    const result = await paginate(query, page, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.advancedFilterMovies = async (req, res) => {
  try {
    const { decade, country, language, keywords, page = 1, limit = 10 } = req.query;

    let filter = {};

    // Filter by decade
    if (decade) {
      const startYear = parseInt(decade);
      const endYear = startYear + 9;
      const startOfDecade = new Date(`${startYear}-01-01`);
      const endOfDecade = new Date(`${endYear}-12-31`);
      filter.releaseDate = { $gte: startOfDecade, $lte: endOfDecade };
    }

    // Filter by country
    if (country) {
      filter.country = country;
    }

    // Filter by language
    if (language) {
      filter.language = language;
    }

    // Keyword search with exact phrase matching
    if (keywords) {
      filter.$text = { $search: `"${keywords}"` }; // Add double quotes for exact phrase
    }

    // Use the paginate utility
    const query = Movie.find(filter);
    const result = await paginate(query, page, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Top 10 movies by genre (Paginated)
exports.getTopMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = Movie.find({ genre }).sort({ averageRating: -1, popularityScore: -1 });
    const result = await paginate(query, page, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Top movies of the month (Paginated)
exports.getTopMoviesOfMonth = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const startDate = new Date();
    startDate.setDate(1); // First day of the current month

    const query = Movie.find({ releaseDate: { $gte: startDate } }).sort({
      popularityScore: -1,
      averageRating: -1,
    });
    const result = await paginate(query, page, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upcoming Movies (Paginated)
exports.getUpcomingMovies = async (req, res) => {
  try {
    const { genre, page = 1, limit = 10 } = req.query;

    const today = new Date();
    const filter = { releaseDate: { $gte: today } }; // Movies with future release dates

    if (genre) {
      filter.genre = genre; // Filter by genre if provided
    }

    const query = Movie.find(filter).sort({ releaseDate: 1 }); // Sort by nearest release date
    const result = await paginate(query, page, limit);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBoxOffice = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { boxOffice } = req.body; // e.g., { openingWeekend: 5000000, domestic: 20000000 }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Ensure boxOffice exists in the movie document
    movie.boxOffice = movie.boxOffice || {}; // Initialize if undefined
    movie.boxOffice = { ...movie.boxOffice, ...boxOffice }; // Merge new data
    await movie.save();

    res.json({ message: 'Box Office updated successfully', boxOffice: movie.boxOffice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Add Awards to a Movie
exports.addMovieAward = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { awardName, category, year, won } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    movie.awards.push({ awardName, category, year, won });
    await movie.save();

    res.json({ message: 'Award added successfully', awards: movie.awards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Award for a Movie
exports.updateMovieAward = async (req, res) => {
  try {
    const { movieId, awardId } = req.params;
    const { awardName, category, year, won } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const award = movie.awards.id(awardId); // Find the award by ID
    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    // Update award fields
    award.awardName = awardName || award.awardName;
    award.category = category || award.category;
    award.year = year || award.year;
    award.won = won !== undefined ? won : award.won;

    await movie.save(); // Save changes to the movie
    res.json({ message: 'Award updated successfully', awards: movie.awards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Award for a Movie
exports.deleteMovieAward = async (req, res) => {
  try {
    const { movieId, awardId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Find and remove the award
    const awardIndex = movie.awards.findIndex(award => award._id.toString() === awardId);
    if (awardIndex === -1) {
      return res.status(404).json({ error: 'Award not found' });
    }

    movie.awards.splice(awardIndex, 1); // Remove the award from the array
    await movie.save();

    res.json({ message: 'Award deleted successfully', awards: movie.awards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Box Office and Awards for a Movie
exports.getMovieDetails = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    res.json({ boxOffice: movie.boxOffice, awards: movie.awards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
