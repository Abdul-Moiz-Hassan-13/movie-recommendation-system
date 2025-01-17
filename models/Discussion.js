const mongoose = require('mongoose');

const discussionSchema = new mongoose.Schema({
  category: { type: String, enum: ['Movies', 'Actors', 'Genres', 'General'], required: true },
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Middleware to delete replies when a discussion is deleted
discussionSchema.pre('remove', async function (next) {
  try {
    // Delete all replies associated with this discussion
    await mongoose.model('Reply').deleteMany({ discussion: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Discussion', discussionSchema);
