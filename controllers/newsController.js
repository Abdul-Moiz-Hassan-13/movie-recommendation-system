const News = require('../models/News');
const paginate = require('../utils/paginate'); // Import pagination utility

// Add a news article
exports.addNews = async (req, res) => {
  try {
    const newsData = req.body;
    const news = new News(newsData);
    await news.save();
    res.status(201).json({ message: 'News added successfully', news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNews = async (req, res) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query; // Extract query parameters
    let filter = {};

    // Apply filtering based on category and tag
    if (category) {
      filter.category = category;
    }
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Use the paginate utility
    const query = News.find(filter).sort({ createdAt: -1 }); // Sort by most recent first
    const paginatedNews = await paginate(query, parseInt(page), parseInt(limit));

    res.json(paginatedNews); // Send the paginated response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single news article by ID
exports.getNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await News.findById(newsId);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a news article (Admin only)
exports.updateNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const updates = req.body;
    const news = await News.findByIdAndUpdate(newsId, updates, { new: true });
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News updated successfully', news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a news article (Admin only)
exports.deleteNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await News.findByIdAndDelete(newsId);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
