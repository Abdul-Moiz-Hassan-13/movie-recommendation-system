const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  discussion: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  parentReply: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Reply', replySchema);
