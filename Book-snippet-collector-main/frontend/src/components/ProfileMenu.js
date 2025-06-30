import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { Settings, Logout, LockReset, AccountCircle } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom'; // Import Link

const ProfileMenu = ({ onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
       <IconButton onClick={handleClick} size="small" sx={{ p: 0 }}>
        <AccountCircle sx={{ width: 38, height: 38, color: 'action.active' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
          },
        }}
      >
        <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem component={RouterLink} to="/forgot-password" onClick={handleClose}>
          <ListItemIcon><LockReset fontSize="small" /></ListItemIcon>
          Change Password
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;