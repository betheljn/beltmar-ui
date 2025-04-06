// src/components/Chatbot.jsx

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Stack
} from '@mui/material';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const userId = 'user123'; // Replace with real user ID logic later
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5050/api/chat', {
        userId,
        userMessage: input
      });

      const botMessage = { sender: 'bot', message: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Failed to chat with bot:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        💬 Chat with Beltmar Assistant
      </Typography>

      <Paper sx={{ p: 2, minHeight: 300, mb: 2, maxHeight: 400, overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              mb: 1,
              textAlign: msg.sender === 'user' ? 'right' : 'left'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                p: 1,
                bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                borderRadius: 2,
                maxWidth: '80%'
              }}
            >
              {msg.message}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Divider sx={{ mb: 2 }} />

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          label="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </Button>
      </Stack>
    </Box>
  );
}