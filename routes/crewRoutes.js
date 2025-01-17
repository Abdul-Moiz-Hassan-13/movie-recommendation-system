// routes/crewRoutes.js
const express = require('express');
const {
  createCrew,
  getCrewProfile,
  getAllCrew,
  updateCrew,
  deleteCrew,
  addCrewAward,
  updateCrewAward,
  deleteCrewAward
} = require('../controllers/crewController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

router.get('/', getAllCrew); // Public route to get all crew members
router.get('/:id', getCrewProfile); // Public route to get a specific crew profile
router.post('/', authMiddleware, adminMiddleware, createCrew); // Admin-only to create a new crew member
router.put('/:id', authMiddleware, adminMiddleware, updateCrew); // Admin-only to update a crew member
router.delete('/:id', authMiddleware, adminMiddleware, deleteCrew); // Admin-only to delete a crew member

router.post('/:crewId/awards', authMiddleware, adminMiddleware, addCrewAward); // Add an award to a crew member
router.put('/:crewId/awards/:awardId', authMiddleware, adminMiddleware, updateCrewAward); // Update an award for a crew member
router.delete('/:crewId/awards/:awardId', authMiddleware, adminMiddleware, deleteCrewAward); // Delete an award for a crew member

module.exports = router;
