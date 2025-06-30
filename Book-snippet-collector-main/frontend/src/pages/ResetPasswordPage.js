import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Alert, CircularProgress, Box } from '@mui/material';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import './Auth.css';

const API_BASE_URL = 'http://localhost:5000';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // Get the token from the URL (e.g., /reset-password/some-token)

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/reset-password/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setSuccess('Your password has been changed successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Paper className="auth-box" elevation={4}>
        <Typography variant="h5" component="h1" gutterBottom>
          Reset Your Password
        </Typography>

        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            fullWidth
            margin="normal"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || success}
          />
          <TextField
            label="Confirm New Password"
            fullWidth
            margin="normal"
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || success}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2, py: 1.5 }}
            disabled={loading || success}
          >
            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default ResetPasswordPage;