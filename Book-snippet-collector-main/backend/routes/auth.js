const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// EMAIL/PASSWORD REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    // Hashing is now handled by the User model's pre-save hook, assuming you've implemented that.
    // If not, you'll need to hash the password here.
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
    });
  })(req, res, next);
});

// LOGOUT
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(200).json({ message: 'Logout successful' });
  });
});


// --- GOOGLE OAUTH ROUTES (Cleaned up and explicit) ---

// 1A. Initiate LOGIN with Google
// This is the route your "Continue with Google" button on the login page should link to.
router.get('/google/login', passport.authenticate('google-login', { scope: ['profile', 'email'] }));

// 1B. Callback for LOGIN with Google
router.get('/google/login/callback',
  passport.authenticate('google-login', {
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: 'http://localhost:3000/login?error=not-registered'
  })
);


// 2A. Initiate SIGNUP with Google
// This is for the "Sign up with Google" button on the signup page.
router.get('/google/signup', passport.authenticate('google-signup', { scope: ['profile', 'email'] }));

// 2B. Callback for SIGNUP with Google
router.get('/google/signup/callback',
  passport.authenticate('google-signup', {
    successRedirect: 'http://localhost:3000/dashboard',
    failureRedirect: 'http://localhost:3000/signup?error=google-signup-failed'
  })
);


module.exports = router;