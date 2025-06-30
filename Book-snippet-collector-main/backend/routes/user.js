const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
  getMe,
  updateUserDetails,
} = require('../controllers/userController');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); // You must have this middleware

// --- Public Password Routes ---
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// --- Protected User Profile Routes ---
// These routes will only work if the user is logged in.
router.get('/me', ensureAuthenticated, getMe);
router.patch('/update-details', ensureAuthenticated, updateUserDetails);

module.exports = router;