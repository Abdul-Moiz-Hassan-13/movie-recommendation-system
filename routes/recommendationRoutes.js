const express = require('express');
const {
  getUserRecommendations,
  getSimilarTitles,
  getTrendingMovies,
  getTopRatedMovies
} = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/user', authMiddleware, getUserRecommendations);
router.get('/similar/:movieId', getSimilarTitles);
router.get('/trending', getTrendingMovies);
router.get('/top-rated', getTopRatedMovies);

module.exports = router;
