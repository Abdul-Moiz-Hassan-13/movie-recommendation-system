// controllers/subscriptionController.js
const { sendNotification } = require('../utils/emailHelper');
const Subscription = require('../models/Subscription');

exports.createSubscription = async (req, res) => {
  try {
    const { movieId, genre, notificationType } = req.body;

    const subscription = new Subscription({
      user: req.user.userId, // Retrieved from authMiddleware
      movie: movieId,
      genre,
      notificationType
    });

    await subscription.save();
    res.status(201).json({ message: 'Subscription created successfully', subscription });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
    try {
      const subscriptions = await Subscription.find({ user: req.user.userId }).populate('movie');
      res.json({ subscriptions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.notifySubscribers = async (req, res) => {
    try {
      const { movieTitle, releaseDate } = req.body;
    
      console.log("notifySubscribers function called"); // Debug log
  
      // Find all users subscribed to this movie or genre
      const subscriptions = await Subscription.find({ movie: req.params.movieId }).populate('user');
      console.log("Subscriptions found:", subscriptions); // Debug log
  
      // Notify each user
      for (const subscription of subscriptions) {
        const userEmail = subscription.user.email;
        console.log("Sending email to:", userEmail); // Debug log
  
        const subject = `Reminder: ${movieTitle} is releasing soon!`;
        const text = `Dear user,\n\nDon't miss the release of "${movieTitle}" on ${releaseDate}. Stay tuned for more updates!`;
  
        await sendNotification(userEmail, subject, text);
      }
  
      res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error("Error in notifySubscribers:", error); // Debug log
      res.status(500).json({ error: error.message });
    }
  };
  