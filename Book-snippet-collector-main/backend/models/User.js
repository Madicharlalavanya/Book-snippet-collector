const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // ✨ NEW: Add a name field
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    select: false, // Don't send password in API responses by default
  },
  googleId: {
    type: String,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

// --- Mongoose Middleware ---

// Hash password before saving if it has been modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.googleId) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// --- Mongoose Methods ---

// Method to create the password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);