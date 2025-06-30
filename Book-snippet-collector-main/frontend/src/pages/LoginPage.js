import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Divider, Box, Link as MuiLink, Alert } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import './Auth.css';

const API_BASE_URL = 'http://localhost:5000';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for a Google auth failure message in the URL when the page loads
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'not-registered') {
      setError('This Google account is not registered. Please sign up first.');
      // Clean the URL so the error message doesn't stay on refresh
      window.history.replaceState(null, '', '/login');
    }
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Paper className="auth-box" elevation={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            fullWidth margin="normal" required type="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Password"
            fullWidth margin="normal" required type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            variant="contained" type="submit" fullWidth
            sx={{ mt: 2, py: 1.5 }} disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Box>
          <Button
            component="a" // Renders as an <a> tag for full-page redirect
            href={`${API_BASE_URL}/api/auth/google/login`} // Points to the new login-specific route
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
          >
            Continue with Google
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Don't have an account?{' '}
          <MuiLink component={RouterLink} to="/register" underline="hover">
            Sign up
          </MuiLink>
        </Typography>
      </Paper>
    </div>
  );
};

export default LoginPage;