const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // --- Profile Fields ---
  name: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [250, 'Bio cannot be more than 250 characters']
  },
  profilePictureUrl: {
    type: String,
  },
  profilePictureCloudinaryId: { // Used to delete the old image from Cloudinary
    type: String,
  },

  // --- Authentication Fields ---
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    select: false,
  },
  googleId: {
    type: String,
  },

  // --- Password Reset Fields ---
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

// --- Mongoose Middleware & Methods ---
// (No changes needed for the pre-save hook or createPasswordResetToken method)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.googleId) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);