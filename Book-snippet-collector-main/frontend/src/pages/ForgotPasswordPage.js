import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, Link as MuiLink, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './Auth.css'; // Re-use the same CSS as your login/signup pages for consistency

const API_BASE_URL = 'http://localhost:5000';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
      }
      
      // For security, always show a generic success message.
      // Do not confirm whether the email exists in your database.
      setSuccess('If an account with that email exists, a password reset link has been sent.');

    } catch (err) {
      // Also show a generic message on error to prevent email enumeration
      setSuccess('If an account with that email exists, a password reset link has been sent.');
      console.error(err.message); // Log the actual error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Paper className="auth-box" elevation={4}>
        <Typography variant="h5" component="h1" gutterBottom>
          Forgot Your Password?
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          No problem. Enter your email address below and we'll send you a link to reset it.
        </Typography>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            margin="normal"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || success} // Disable after success
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
            disabled={loading || success}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <MuiLink component={RouterLink} to="/login" underline="hover">
            ← Back to Login
          </MuiLink>
        </Box>
      </Paper>
    </div>
  );
};

export default ForgotPasswordPage;