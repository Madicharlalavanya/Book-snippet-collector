import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Container, CircularProgress, Alert, Paper,
  Chip, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Modal, IconButton
} from '@mui/material';
import { Search as SearchIcon, Casino as CasinoIcon, Close as CloseIcon } from '@mui/icons-material';
import AddSnippetForm from '../components/AddSnippetForm';
import ProfileMenu from '../components/ProfileMenu';
import './Dashboard.css';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const EMOTION_TAGS = [
  "Inspiration", "Motivation", "Wisdom", "Humor", "Love", "Sadness", 
  "Courage", "Hope", "Reflection", "Adventure", "Nostalgia", "Peace"
];
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Reusable SnippetCard: now takes an onCardClick prop to open the details modal
const SnippetCard = ({ snippet, onCardClick }) => (
  <Box className="snippet-card-wrapper" onClick={() => onCardClick(snippet)}>
    <Paper elevation={0} className="snippet-card">
      <Typography className="snippet-card-text">"{snippet.text}"</Typography>
      <Box sx={{ mt: 'auto', pt: 1 }}>
        <Typography className="snippet-card-meta">
          - {snippet.author || 'Unknown Author'}, from "{snippet.bookName || 'Unknown Book'}"
        </Typography>
        <Chip label={snippet.emotion} color="primary" size="small" sx={{ mt: 1 }} />
      </Box>
    </Paper>
  </Box>
);

const DashboardPage = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const navigate = useNavigate();

  // Filter state
  const [emotionFilter, setEmotionFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortOrder, setSortOrder] = useState('desc');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

  // State for the Snippet Details Modal
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  const fetchSnippets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (emotionFilter) params.append('emotion', emotionFilter);
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (sortOrder) params.append('sort', sortOrder);
      if (contentTypeFilter !== 'all') params.append('hasImage', contentTypeFilter);
      const response = await apiClient.get(`/api/snippets?${params.toString()}`);
      setSnippets(response.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else setError('Failed to load snippets.');
    } finally {
      setLoading(false);
    }
  }, [emotionFilter, debouncedSearchTerm, sortOrder, contentTypeFilter, navigate]);

  useEffect(() => { fetchSnippets(); }, [fetchSnippets]);

  const handleLogout = async () => {
    try {
      await apiClient.get('/api/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

    const handlePickRandom = async () => {
    try {
      const response = await apiClient.get('/api/snippets/random');
      setSelectedSnippet(response.data); // Open the details modal with the random snippet
    } catch (err) {
      // Display the specific error message from the backend
      alert(err.response?.data?.message || "Could not fetch a random snippet.");
    }
  };

  return (
    <>
      <AddSnippetForm open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} apiClient={apiClient} onSnippetAdded={fetchSnippets} />

      {/* Snippet Details Modal */}
      <Modal open={!!selectedSnippet} onClose={() => setSelectedSnippet(null)}>
        <Box className="details-modal-box">
          {selectedSnippet && (
            <>
              <IconButton
                aria-label="close"
                onClick={() => setSelectedSnippet(null)}
                sx={{ position: 'absolute', top: 8, right: 8, color: (theme) => theme.palette.grey[500] }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h5" component="h2" gutterBottom>
                {selectedSnippet.bookName || 'Snippet Details'}
              </Typography>
              {selectedSnippet.imageUrl && (
                <img src={selectedSnippet.imageUrl} alt={selectedSnippet.bookName || 'Snippet'} className="modal-image" />
              )}
              <Typography className="snippet-card-text" sx={{ fontStyle: 'italic', mb: 2 }}>
                "{selectedSnippet.text}"
              </Typography>
              <Typography className="snippet-card-meta" color="text.secondary">
                - {selectedSnippet.author || 'Unknown Author'} (p. {selectedSnippet.pageNo || 'N/A'})
              </Typography>
              <Chip label={selectedSnippet.emotion} color="primary" sx={{ mt: 2 }} />
              {selectedSnippet.description && (
                <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                  <strong>Description:</strong> {selectedSnippet.description}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>

      <Container maxWidth="lg" className="dashboard-container">
        <Box className="dashboard-header">
           <Typography variant="h4" component="h1" className="dashboard-header-title">My Snippets</Typography>
           <Box className="dashboard-header-actions">
             <Button variant="contained" onClick={() => setIsAddModalOpen(true)}>Add Snippet</Button>
             <ProfileMenu onLogout={handleLogout} />
           </Box>
        </Box>

        <Box className="filter-controls-container">
          <Box className="advanced-filters">
            <TextField
              className="search-bar"
              placeholder="Search author, book, or quote..."
              variant="outlined" size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortOrder} label="Sort By" onChange={(e) => setSortOrder(e.target.value)}>
                <MenuItem value="desc">Newest First</MenuItem>
                <MenuItem value="asc">Oldest First</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Content Type</InputLabel>
              <Select value={contentTypeFilter} label="Content Type" onChange={(e) => setContentTypeFilter(e.target.value)}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">With Image</MenuItem>
                <MenuItem value="false">Text Only</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" startIcon={<CasinoIcon />} onClick={handlePickRandom}>Pick Random</Button>
          </Box>
        </Box>

        <Box className="emotion-tags-container">
          {EMOTION_TAGS.map(tag => (
            <Chip key={tag} label={tag} onClick={() => setEmotionFilter(current => (current === tag ? null : tag))} color={emotionFilter === tag ? "secondary" : "default"} clickable />
          ))}
          {emotionFilter && <Button size="small" variant="text" onClick={() => setEmotionFilter(null)}>Clear</Button>}
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : snippets.length > 0 ? (
          <Box className="snippets-grid">
            {snippets.map(snippet => (
              <SnippetCard key={snippet._id} snippet={snippet} onCardClick={setSelectedSnippet} />
            ))}
          </Box>
        ) : (
          <Paper className="no-snippets-paper">
            <Typography variant="h6">No snippets match your criteria.</Typography>
            <Typography color="text.secondary">Try adjusting your search or filters.</Typography>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default DashboardPage;