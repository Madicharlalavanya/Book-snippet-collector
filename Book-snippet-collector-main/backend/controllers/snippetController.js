const mongoose = require('mongoose'); // ✨ 1. ADD THIS IMPORT
const Snippet = require('../models/Snippet');
const cloudinary = require('../config/cloudinary');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "book_snippets" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// @desc    Create a new snippet
// @route   POST /api/snippets
const createSnippet = async (req, res) => {
  try {
    const { text, author, bookName, pageNo, emotion, description } = req.body;
    if (!text || !emotion) {
      return res.status(400).json({ message: 'Text and emotion tags are required.' });
    }
    const newSnippetData = {
      user: req.user.id,
      text, author, bookName, pageNo, emotion, description
    };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      newSnippetData.imageUrl = result.secure_url;
      newSnippetData.cloudinaryId = result.public_id;
    }
    const newSnippet = new Snippet(newSnippetData);
    const savedSnippet = await newSnippet.save();
    res.status(201).json(savedSnippet);
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({ message: 'Server error while creating snippet.' });
  }
};

// @desc    Get all snippets for the logged-in user
// @route   GET /api/snippets
const getSnippets = async (req, res) => {
  try {
    const query = { user: req.user.id };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ text: searchRegex }, { author: searchRegex }, { bookName: searchRegex }];
    }
    if (req.query.emotion) { query.emotion = req.query.emotion; }
    if (req.query.hasImage === 'true') { query.imageUrl = { $exists: true, $ne: null }; }
    if (req.query.hasImage === 'false') { query.imageUrl = { $exists: false }; }

    const sortOption = {};
    if (req.query.sort === 'asc') { sortOption.createdAt = 1; }
    else { sortOption.createdAt = -1; }

    const snippets = await Snippet.find(query).sort(sortOption);
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching snippets.' });
  }
};

// @desc    Get a single random snippet for the logged-in user
// @route   GET /api/snippets/random
const getRandomSnippet = async (req, res) => {
  try {
    // This line will now work correctly because mongoose is imported.
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const randomSnippets = await Snippet.aggregate([
      { $match: { user: userId } },
      { $sample: { size: 1 } }
    ]);

    if (!randomSnippets || randomSnippets.length === 0) {
      return res.status(404).json({ message: "You don't have any snippets to pick from yet!" });
    }

    res.status(200).json(randomSnippets[0]);

  } catch (error) {
    console.error('--- GET RANDOM SNIPPET ERROR ---', error);
    res.status(500).json({ message: 'Server error while fetching a random snippet.' });
  }
};

module.exports = {
  createSnippet,
  getSnippets,
  getRandomSnippet,
};