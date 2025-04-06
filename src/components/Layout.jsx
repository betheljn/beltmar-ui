// src/components/Layout.jsx

import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const navLinks = [
  { label: 'Dashboard', path: '/' },
  { label: 'Campaigns', path: '/campaigns' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Chatbot', path: '/chat' }
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f4f4f4'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navLinks.map((link) => (
              <ListItem
                button
                key={link.path}
                component={Link}
                to={link.path}
                selected={location.pathname === link.path}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Beltmar
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
