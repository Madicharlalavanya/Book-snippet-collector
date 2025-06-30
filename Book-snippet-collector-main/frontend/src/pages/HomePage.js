// src/pages/HomePage.js
import React, { useEffect } from 'react'; 
import { Typography, Button, Box } from '@mui/material';
import './HomePage.css';
import { Link } from 'react-router-dom';

//...

const HomePage = () => {
  // ✨ 2. Add this useEffect hook
  useEffect(() => {
    // When the HomePage mounts, add the 'no-scroll' class to the body
    document.body.classList.add('no-scroll');

    // When the HomePage unmounts (navigates away), remove the class
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <header className="navbar">
        <Typography variant="h5" className="logo">
          📚 Book Snippet Collector
        </Typography>
        <Box>
          <Button className="login-button" variant="contained" component={Link} to="/login">
            Login
          </Button>
        </Box>
      </header>

      {/* Main Content */}
      <main className="main-content">
  <div className="main-box">
    <Typography variant="h2" gutterBottom>
      Capture the Lines that Move You
    </Typography>
    <Typography variant="h6" paragraph>
      Save powerful quotes, highlight what resonates, and revisit them for daily inspiration.
    </Typography>
    <Typography variant="h6" paragraph>
      Simple, personal, and made just for book lovers.
    </Typography>

    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
      
      <Button variant="contained" size="large" component={Link} to="/login" className="cta-button">Get Started</Button>
<Button variant="contained" size="large" component={Link} to="/register" className="cta-button">Create Account</Button>
    </Box>
  </div>
</main>

     { /* Footer 
      <footer className="footer">
        <div className="footer-content">
          <Typography variant="body2">
            <strong>📘 Book Snippet Collector</strong> — Your personal quote library.
          </Typography>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} All rights reserved.
          </Typography>
        </div>
      </footer>*/}
    </div>
  )
}

export default HomePage
