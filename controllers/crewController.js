// controllers/crewController.js
const Crew = require('../models/Crew');
const Movie = require('../models/Movie');
const paginate = require('../utils/paginate'); // Import the pagination utility

// Create a new crew member
exports.createCrew = async (req, res) => {
  try {
    const crew = new Crew(req.body);
    await crew.save();
    res.status(201).json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific crew profile by ID
exports.getCrewProfile = async (req, res) => {
  try {
    const crew = await Crew.findById(req.params.id).populate('filmography.movie'); // Populate movie details in filmography
    if (!crew) return res.status(404).json({ message: 'Crew member not found' });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all crew members with optional role filtering and pagination
exports.getAllCrew = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query; // Extract pagination params from query
    const filter = role ? { role } : {};

    const query = Crew.find(filter); // Query to find crew based on the role filter (if provided)
    const crew = await paginate(query, parseInt(page), parseInt(limit)); // Apply pagination

    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a crew profile
exports.updateCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crew) return res.status(404).json({ message: 'Crew member not found' });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a crew profile
exports.deleteCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    if (!crew) return res.status(404).json({ message: 'Crew member not found' });
    res.json({ message: 'Crew profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCrewAward = async (req, res) => {
  try {
    const { crewId } = req.params;
    const { awardName, category, year, won } = req.body;

    const crew = await Crew.findById(crewId);
    if (!crew) {
      return res.status(404).json({ error: 'Crew member not found' });
    }

    const newAward = { awardName, category, year, won };
    crew.awards.push(newAward);
    await crew.save();

    res.status(201).json({ message: 'Award added successfully', awards: crew.awards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCrewAward = async (req, res) => {
  try {
    const { crewId, awardId } = req.params;
    const { awardName, category, year, won } = req.body;

    const crew = await Crew.findById(crewId);
    if (!crew) {
      return res.status(404).json({ error: 'Crew member not found' });
    }

    const award = crew.awards.id(awardId); // Find the specific award
    if (!award) {
      return res.status(404).json({ error: 'Award not found' });
    }

    // Update the award fields
    if (awardName) award.awardName = awardName;
    if (category) award.category = category;
    if (year) award.year = year;
    if (won !== undefined) award.won = won;

    await crew.save();

    res.json({ message: 'Award updated successfully', awards: crew.awards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCrewAward = async (req, res) => {
  try {
    const { crewId, awardId } = req.params;

    const crew = await Crew.findById(crewId);
    if (!crew) {
      return res.status(404).json({ error: 'Crew member not found' });
    }

    const awardIndex = crew.awards.findIndex(award => award._id.toString() === awardId);
    if (awardIndex === -1) {
      return res.status(404).json({ error: 'Award not found' });
    }

    crew.awards.splice(awardIndex, 1); // Remove the award
    await crew.save();

    res.json({ message: 'Award deleted successfully', awards: crew.awards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
