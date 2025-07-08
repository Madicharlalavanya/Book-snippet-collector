const express = require('express');
const router = express.Router();

// --- Controller and Middleware Imports ---

const {
  forgotPassword,
  resetPassword,
  getMe,
  updateUserDetails,
  deleteAccount, // ✨ CORRECTION: Import the new deleteAccount function
} = require('../controllers/userController');

const { ensureAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/multer'); // ✨ CORRECTION: Import the multer middleware


router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

router.get('/me', ensureAuthenticated, getMe);


router.patch('/update-details', ensureAuthenticated, upload.single('profilePicture'), updateUserDetails);


router.delete('/delete-account', ensureAuthenticated, deleteAccount); // ✨ CORRECTION: Add the new delete route


module.exports = router;