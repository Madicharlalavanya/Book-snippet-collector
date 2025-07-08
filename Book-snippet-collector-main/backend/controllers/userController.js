const User = require('../models/User');
const Snippet = require('../models/Snippet'); // ✨ FIX: Added missing import for Snippet model
const cloudinary = require('../config/cloudinary'); // ✨ FIX: Added missing import for Cloudinary config
const sendEmail = require('../utils/mailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');


// --- HELPER FUNCTIONS ---

// Helper function to upload files to Cloudinary
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};


// --- EXPORTED CONTROLLERS ---

// --- PASSWORD MANAGEMENT ---

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      console.log(`Password reset attempt for non-existent user: ${req.body.email}`);
      return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `You have requested to set/reset your password. Please click the link to proceed: ${resetURL}\n\nThis link is valid for 10 minutes. If you did not request this, please ignore this email.`;
    await sendEmail({
      email: user.email,
      subject: 'Your Password Set/Reset Link',
      message
    });
    res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('--- FORGOT PASSWORD CONTROLLER ERROR ---', err);
    res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' });
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    req.login(user, err => {
      if (err) return res.status(500).json({ message: 'Error logging in after password reset.' });
      res.status(200).json({ message: 'Password changed successfully.' });
    });
  } catch (err) {
    console.error('--- RESET PASSWORD CONTROLLER ERROR ---', err);
    res.status(500).json({ message: 'Server error while resetting password.' });
  }
};


// --- USER PROFILE MANAGEMENT ---

// GET /api/user/me
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
};

// PATCH /api/user/update-details
exports.updateUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const { name, bio } = req.body;
    const fieldsToUpdate = {};

    if (name !== undefined) fieldsToUpdate.name = name;
    if (bio !== undefined) fieldsToUpdate.bio = bio;

    if (req.file) {
      const currentUser = await User.findById(req.user.id);
      if (currentUser && currentUser.profilePictureCloudinaryId) {
        await cloudinary.uploader.destroy(currentUser.profilePictureCloudinaryId);
      }

      const result = await uploadToCloudinary(req.file.buffer, 'profile_pictures');
      fieldsToUpdate.profilePictureUrl = result.secure_url;
      fieldsToUpdate.profilePictureCloudinaryId = result.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('--- UPDATE USER DETAILS ERROR ---', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

// DELETE /api/user/delete-account
exports.deleteAccount = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const userId = req.user.id;
    const currentUser = await User.findById(userId);

    // Delete all snippet images from Cloudinary
    const userSnippets = await Snippet.find({ user: userId });
    if (userSnippets.length > 0) {
      const cloudinaryIds = userSnippets
        .map(snippet => snippet.cloudinaryId)
        .filter(id => id);
      if (cloudinaryIds.length > 0) {
        await cloudinary.api.delete_resources(cloudinaryIds);
      }
    }

    // Delete the user's profile picture
    if (currentUser && currentUser.profilePictureCloudinaryId) {
      await cloudinary.uploader.destroy(currentUser.profilePictureCloudinaryId);
    }
    
    // Delete all snippets from MongoDB
    await Snippet.deleteMany({ user: userId });

    // Delete the user document itself
    await User.findByIdAndDelete(userId);

    req.logout(function(err) {
      if (err) console.error("Error during logout after account deletion:", err);
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Account and all associated data have been permanently deleted.' });
    });

  } catch (error) {
    console.error('--- DELETE ACCOUNT CONTROLLER ERROR ---', error);
    res.status(500).json({ message: 'Server error while deleting account.' });
  }
};