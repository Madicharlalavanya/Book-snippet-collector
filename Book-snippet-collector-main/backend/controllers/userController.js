const User = require('../models/User');
const sendEmail = require('../utils/mailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
    user.password = req.body.password; // The pre-save hook will hash it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    req.login(user, err => {
      if (err) return res.status(500).json({ message: 'Error logging in after password reset.' });
      res.status(200).json({ message: 'Password changed successfully.' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error while resetting password.' });
  }
};

// --- ✨ NEW: USER PROFILE MANAGEMENT ---

// @desc    Get current logged-in user's details
// @route   GET /api/user/me
exports.getMe = async (req, res) => {
  try {
    // req.user is populated by Passport from the session
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
};

// @desc    Update user details (e.g., name)
// @route   PATCH /api/user/update-details
exports.updateUserDetails = async (req, res) => {
  try {
    const { name } = req.body;
    // We only allow updating the 'name' field from this endpoint for security.
    const fieldsToUpdate = { name };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true, // Return the updated document
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
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};