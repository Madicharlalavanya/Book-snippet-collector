import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Button, Divider, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Modal, TextField, CircularProgress, Alert, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import './SettingsPage.css';

const apiClient = axios.create({ baseURL: 'http://localhost:5000', withCredentials: true });

const SettingsPage = () => {
  const navigate = useNavigate();

  // State for user data, modals, and forms
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch current user data when the page loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/api/user/me');
        const userData = response.data.user;
        setUser(userData);
        setName(userData.name || '');
        setBio(userData.bio || '');
        setPreviewImage(userData.profilePictureUrl);
      } catch (error) {
        navigate('/login');
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleOpenProfileModal = () => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setPreviewImage(user?.profilePictureUrl);
    setProfilePictureFile(null);
    setFormMessage({ type: '', text: '' });
    setIsProfileModalOpen(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage({ type: '', text: '' });
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }
    try {
      const response = await apiClient.patch('/api/user/update-details', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(response.data.user);
      setFormMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setIsProfileModalOpen(false), 1500);
    } catch (error) {
      setFormMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await apiClient.delete('/api/user/delete-account');
      navigate('/');
    } catch (error) {
      setDeleteError(error.response?.data?.message || "Could not delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (pageLoading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} sx={{ zIndex: 1300 }}>
        {/* ✨ UPDATED: The Box now uses the correct class name and has a structured form inside */}
        <Box className="edit-profile-modal-box">
          <form onSubmit={handleProfileUpdate}>
            <Box className="form-header">
              <Typography variant="h6" component="h2">Edit Profile</Typography>
            </Box>

            <Box className="form-content">
              {formMessage.text && <Alert severity={formMessage.type} sx={{mb: 2}}>{formMessage.text}</Alert>}

              <Box className="profile-picture-uploader">
                <Avatar src={previewImage} className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Box className="profile-avatar-actions">
                  <Button component="label" startIcon={<PhotoCamera />} size="small">
                    Upload Photo
                    <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                  </Button>
                  <Typography variant="caption">JPG, PNG up to 5MB.</Typography>
                </Box>
              </Box>

              <TextField label="Full Name" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} disabled={formLoading} />
              <TextField label="Bio / Description" fullWidth margin="normal" multiline rows={3} value={bio} onChange={(e) => setBio(e.target.value)} disabled={formLoading} placeholder="Tell us a little about yourself..." />
              <TextField label="Email Address" fullWidth margin="normal" value={user?.email || ''} disabled helperText="Email cannot be changed." />
            </Box>

            <Box className="form-actions">
              <Button onClick={() => setIsProfileModalOpen(false)} disabled={formLoading}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={formLoading}>
                {formLoading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => !deleteLoading && setIsDeleteDialogOpen(false)}>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is permanent. This will delete your account and all your snippet data.
          </DialogContentText>
          {deleteError && <Alert severity="error" sx={{ mt: 2 }}>{deleteError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteLoading}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Deletion'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main Settings Page Content */}
      <Container maxWidth="md" className="settings-page-container">
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>Account Settings</Typography>
        
        <Box className="user-identity-display">
          <Avatar src={user?.profilePictureUrl} sx={{ width: 64, height: 64, fontSize: '2rem' }}>
            {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6">{user?.name || "User"}</Typography>
            <Typography color="text.secondary">{user?.email}</Typography>
          </Box>
        </Box>

        <Box className="settings-sections-wrapper">
          <Paper component="section" className="settings-section-card" variant="outlined">
            <Box className="settings-section-content">
              <Typography variant="h6">Profile</Typography>
              <Typography color="text.secondary">Update your name, bio, and profile picture.</Typography>
            </Box>
            <Box className="settings-section-actions">
              <Button variant="outlined" onClick={handleOpenProfileModal}>Edit Profile</Button>
            </Box>
          </Paper>

          <Paper component="section" className="settings-section-card" variant="outlined">
            <Box className="settings-section-content">
              <Typography variant="h6">Password</Typography>
              <Typography color="text.secondary">Change your password or set one if you used Google to sign up.</Typography>
            </Box>
            <Box className="settings-section-actions">
              <Button variant="contained" onClick={() => navigate('/forgot-password')}>Change Password</Button>
            </Box>
          </Paper>
          
          <Paper component="section" className="settings-section-card" variant="outlined">
            <Box className="settings-section-content">
              <Typography variant="h6" color="error">Delete Account</Typography>
              <Typography color="text.secondary">Permanently delete your account and all associated data.</Typography>
            </Box>
            <Box className="settings-section-actions">
              <Button variant="contained" color="error" onClick={() => setIsDeleteDialogOpen(true)}>Delete My Account</Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default SettingsPage;