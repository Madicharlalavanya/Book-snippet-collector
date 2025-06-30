import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Button, Divider, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Modal, TextField, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SettingsPage.css'; // Make sure this CSS file exists and is styled

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const SettingsPage = () => {
  const navigate = useNavigate();

  // State for user data and page loading
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  // State for the "Edit Profile" modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [name, setName] = useState('');

  // State for the "Delete Account" confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // State for form submission feedback
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // --- Data Fetching ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/api/user/me');
        setUser(response.data.user);
        setName(response.data.user.name || ''); // Pre-fill name for the edit form
      } catch (error) {
        console.error("Failed to fetch user data. Redirecting to login.", error);
        navigate('/login'); // Redirect if not authenticated
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // --- Handlers ---
  const handleOpenProfileModal = () => {
    setFormMessage({ type: '', text: '' }); // Clear previous messages before opening
    setIsProfileModalOpen(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormMessage({ type: '', text: '' });
    try {
      const response = await apiClient.patch('/api/user/update-details', { name });
      setUser(response.data.user); // Update user state with the new data from the server
      setFormMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Close the modal after a short delay to show the success message
      setTimeout(() => {
        setIsProfileModalOpen(false);
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      setFormMessage({ type: 'error', text: errorMessage });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    // In a real app, you would add an API call here, e.g., apiClient.delete('/api/user/delete-account')
    console.log("Account deletion initiated...");
    setIsDeleteDialogOpen(false);
    // After successful deletion, you would force a logout and redirect.
    // navigate('/login');
  };

  // --- Render Logic ---
  if (pageLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}>
        {/* Assumes a .modal-box class in your CSS for styling */}
        <Box className="modal-box"> 
          <Typography variant="h6" component="h2" gutterBottom>Edit Profile</Typography>
          
          <form onSubmit={handleProfileUpdate}>
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={formSubmitting}
            />
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              value={user?.email || ''}
              disabled // Email should not be editable
              helperText="Email addresses cannot be changed."
            />
            
            {formMessage.text && <Alert severity={formMessage.type} sx={{ mt: 2 }}>{formMessage.text}</Alert>}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setIsProfileModalOpen(false)} disabled={formSubmitting}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={formSubmitting}>
                {formSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is permanent and cannot be undone. This will permanently delete your account
            and remove all your snippet data from our servers.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Confirm Deletion
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Settings Page Content */}
      <Container maxWidth="md" className="settings-page-container">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Account Settings
        </Typography>

        <Box className="settings-sections-wrapper">
          {/* Section 1: Profile Information */}
          <Paper component="section" className="settings-section-card" variant="outlined">
            <Box className="settings-section-content">
              <Typography variant="h6" component="h2">Profile Information</Typography>
              <Typography color="text.secondary">
                {user?.name ? `Logged in as ${user.name} (${user.email})` : "Update your personal details."}
              </Typography>
            </Box>
            <Box className="settings-section-actions">
              <Button variant="outlined" onClick={handleOpenProfileModal}>Edit Profile</Button>
            </Box>
          </Paper>

          {/* Section 2: Change Password */}
          <Paper component="section" className="settings-section-card" variant="outlined">
            <Box className="settings-section-content">
              <Typography variant="h6" component="h2">Password</Typography>
              <Typography color="text.secondary">
                Change your password or set one if you signed up with Google.
              </Typography>
            </Box>
            <Box className="settings-section-actions">
              <Button variant="contained" onClick={() => navigate('/forgot-password')}>
                Change Password
              </Button>
            </Box>
          </Paper>
          
          {/* Section 3: Delete Account */}
          <Paper component="section" className="settings-section-card" variant="outlined">
            <Box className="settings-section-content">
              <Typography variant="h6" component="h2" color="error">
                Delete Account
              </Typography>
              <Typography color="text.secondary">
                Permanently delete your account and all associated data.
              </Typography>
            </Box>
            <Box className="settings-section-actions">
              <Button variant="contained" color="error" onClick={() => setIsDeleteDialogOpen(true)}>
                Delete My Account
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default SettingsPage;