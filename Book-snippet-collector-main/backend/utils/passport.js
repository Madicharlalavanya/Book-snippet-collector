// backend/utils/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy; // ✨ 1. IMPORT LOCAL STRATEGY
const bcrypt = require('bcryptjs');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ✨ 2. ADD LOCAL STRATEGY for Email/Password Login
passport.use(new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return done(null, false, { message: 'This email is not registered. Please sign up.' });
      }
      if (!user.password) {
        return done(null, false, { message: 'This account was created using Google. Please log in with Google.' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password. Please try again.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// ✨ STRATEGY 1: FOR THE LOGIN PAGE (will NOT create a user)
passport.use('google-login', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/login/callback" // Specific callback for login
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ googleId: profile.id });

      if (user) {
        // If user is found, success!
        return done(null, user);
      } else {
        // If user is NOT found, fail the authentication with a specific message.
        return done(null, false, { message: 'This Google account is not registered. Please sign up first.' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

// ✨ STRATEGY 2: FOR THE SIGNUP PAGE (will create a user if they are new)
passport.use('google-signup', new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/signup/callback" // Specific callback for signup
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        return done(null, user); // User already exists, just log them in.
      }

      const existingEmailUser = await User.findOne({ email: profile.emails[0].value });
      if (existingEmailUser) {
        return done(null, false, { message: 'This email is already registered with a password.' });
      }

      // If the user is truly new, create the account.
      const newUser = await User.create({
        email: profile.emails[0].value,
        googleId: profile.id,
      });
      return done(null, newUser);

    } catch (error) {
      return done(error);
    }
  }
));