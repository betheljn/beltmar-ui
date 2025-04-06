// src/pages/ChatPage.jsx
import React from 'react';
import { Box } from '@mui/material';
import Chatbot from '../components/Chatbot';

export default function ChatPage() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 700,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Chatbot />
      </Box>
    </Box>
  );
}


