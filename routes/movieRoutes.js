const express = require('express');
const { addMovie, updateMovie, deleteMovie, getMovies, searchMovies, getTopMoviesByGenre, getTopMoviesOfMonth } = require('../controllers/movieController');
const { filterByRating, filterByPopularity, filterByReleaseYear } = require('../controllers/movieController');
const { advancedFilterMovies } = require('../controllers/movieController');
const {getUpcomingMovies} = require('../controllers/movieController');
const { updateBoxOffice, addMovieAward, getMovieDetails, updateMovieAward, deleteMovieAward } = require('../controllers/movieController');
const authMiddleware = require('../middlewares/authMiddleware'); // Add admin check if required
const adminMiddleware = require('../middlewares/adminMiddleware'); // Import the admin middleware
const router = express.Router();

router.get('/', getMovies);
router.post('/', authMiddleware, addMovie);        // Admin-only
router.put('/:id', authMiddleware, updateMovie);   // Admin-only
router.delete('/:id', authMiddleware, deleteMovie); // Admin-only

router.get('/search', searchMovies);
router.get('/filter/rating', filterByRating);
router.get('/filter/popularity', filterByPopularity);
router.get('/filter/release-year', filterByReleaseYear);
router.get('/advanced-filter', advancedFilterMovies);
router.get('/top/genre/:genre', getTopMoviesByGenre); // Top 10 movies by genre
router.get('/top/month', getTopMoviesOfMonth);        // Top movies of the month
router.get('/upcoming', getUpcomingMovies);
router.put('/:movieId/box-office', authMiddleware, adminMiddleware, updateBoxOffice);
router.post('/:movieId/awards', authMiddleware, adminMiddleware, addMovieAward);
router.get('/:movieId/details', getMovieDetails);
router.put('/:movieId/awards/:awardId', authMiddleware, adminMiddleware, updateMovieAward);
router.delete('/:movieId/awards/:awardId', authMiddleware, adminMiddleware, deleteMovieAward); // Delete an Award

module.exports = router;