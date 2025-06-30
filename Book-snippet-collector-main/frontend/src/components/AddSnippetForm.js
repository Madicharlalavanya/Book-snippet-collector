import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Alert, CircularProgress, Divider
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
// No need to import Dashboard.css here if it's imported in a higher-level component like App.js

const EMOTION_TAGS = ["Inspiration", "Humor", "Wisdom", "Love", "Sadness", "Motivation"];
const initialFormData = { text: '', author: '', bookName: '', pageNo: '', emotion: '', description: '' };

const AddSnippetForm = ({ open, onClose, apiClient, onSnippetAdded }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
      setImageFile(null);
      setError('');
      setIsSubmitting(false);
    }
  }, [open]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text || !formData.emotion) {
      setError('Snippet text and an emotion tag are required.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    if (imageFile) {
      submissionData.append('snippetImage', imageFile);
    }

    try {
      await apiClient.post('/api/snippets', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSnippetAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the snippet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* ✨ UPDATED: Using new CSS classes for better structure */}
      <Box className="add-snippet-modal-box">
        <form onSubmit={handleSubmit}>
          <Box className="form-header">
            <Typography variant="h6" component="h2">Add a New Snippet</Typography>
          </Box>
          
          <Box className="form-content">
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField
              label="Snippet Text / Quote" name="text" value={formData.text}
              onChange={handleChange} multiline rows={4} fullWidth required margin="normal" disabled={isSubmitting}
            />
            <TextField label="Author" name="author" value={formData.author} onChange={handleChange} fullWidth margin="normal" disabled={isSubmitting} />
            <TextField label="Book Name" name="bookName" value={formData.bookName} onChange={handleChange} fullWidth margin="normal" disabled={isSubmitting} />
            <TextField label="Page No." name="pageNo" value={formData.pageNo} onChange={handleChange} fullWidth margin="normal" disabled={isSubmitting} />
            <FormControl fullWidth required margin="normal" disabled={isSubmitting}>
              <InputLabel>Emotion</InputLabel>
              <Select name="emotion" value={formData.emotion} label="Emotion" onChange={handleChange}>
                {EMOTION_TAGS.map(tag => (
                  <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Description (Optional)" name="description" value={formData.description} onChange={handleChange} fullWidth multiline margin="normal" disabled={isSubmitting} />
            
            <Button
              variant="outlined" component="label" startIcon={<PhotoCamera />}
              sx={{ mt: 1, mb: 1 }} disabled={isSubmitting}
            >
              Upload Image
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {imageFile && <Typography variant="body2" color="text.secondary" sx={{ml: 1, display: 'inline'}}>{imageFile.name}</Typography>}
          </Box>

          <Box className="form-actions">
            <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : 'Save Snippet'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default AddSnippetForm;