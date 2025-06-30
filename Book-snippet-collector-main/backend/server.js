const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');

// --- REQUIRES ---
require('dotenv').config();
require('./utils/passport');
const authRoutes = require('./routes/auth');
const snippetRoutes = require('./routes/snippet');
const userRoutes = require('./routes/user'); // ✨ REQUIRE here at the top

const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'a-very-strong-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true }
}));
app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/snippets', snippetRoutes);
app.use('/api/user', userRoutes); // ✨ USE routes here, after middleware

// --- DB & SERVER START ---
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/book-snippet-db')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));