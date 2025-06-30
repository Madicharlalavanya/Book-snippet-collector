const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  // ✨ RENAMED & UPDATED
  imageUrl: {
    type: String,
  },
  // ✨ NEW: Store the public_id from Cloudinary to allow for deletion
  cloudinaryId: {
    type: String,
  },
  author: {
    type: String,
    trim: true,
  },
  bookName: {
    type: String,
    trim: true,
  },
  pageNo: {
    type: String,
  },
  emotion: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, { timestamps: true }); // Using timestamps is a cleaner way to get createdAt/updatedAt

module.exports = mongoose.model('Snippet', SnippetSchema);