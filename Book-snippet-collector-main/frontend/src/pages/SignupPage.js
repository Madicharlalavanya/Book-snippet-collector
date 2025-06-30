import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Alert, Divider, Box, Link as MuiLink } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import './Auth.css';

const API_BASE_URL = 'http://localhost:5000';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      setSuccess('Signup successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2s
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <Paper className="auth-box" elevation={4}>
        <Typography variant="h4" gutterBottom>Create Account</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSignup}>
          <TextField
            label="Email"
            fullWidth margin="normal" required type="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth margin="normal" required type="password"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            fullWidth margin="normal" required type="password"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2, py: 1.5 }}>
            Create Account
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Box>
          <Button
            component="a"
            href={`${API_BASE_URL}/api/auth/google/signup`} // Points to the new signup-specific route
            variant="outlined"
            startIcon={<GoogleIcon />}
            fullWidth
          >
            Sign up with Google
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <MuiLink component={RouterLink} to="/login" underline="hover">
            Log in
          </MuiLink>
        </Typography>
      </Paper>
    </div>
  );
};

export default SignupPage;