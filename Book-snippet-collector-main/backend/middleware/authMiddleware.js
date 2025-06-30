// backend/middleware/authMiddleware.js

// A simple middleware to check if the user is authenticated.
// Passport adds the `isAuthenticated()` method to the request object.
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  // If not authenticated, send an error
  res.status(401).json({ message: 'Unauthorized: Please log in to access this resource.' });
};

module.exports = { ensureAuthenticated };