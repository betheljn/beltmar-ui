import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Stack,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatbotHelpPanel from './ChatbotHelpPanel';

export default function Chatbot() {
  const userId = 'user123'; // Replace with real auth later
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/chat/${userId}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    loadHistory();
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: 'user',
      message: input,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5050/api/chat', {
        userId,
        userMessage: input
      });

      const botMessage = {
        sender: 'bot',
        message: res.data.reply,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Chat with Beltmar Assistant
        </Typography>
        <Button variant="outlined" size="small" onClick={() => navigate('/')}>
          Back to Dashboard
        </Button>
      </Box>

      <Paper
        sx={{
          flexGrow: 1,
          p: 2,
          mb: 1,
          overflowY: 'auto',
          border: '1px solid #ddd',
        }}
      >
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 1, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                p: 1,
                bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                borderRadius: 2,
                maxWidth: '85%',
                wordBreak: 'break-word',
              }}
            >
              {msg.message}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', opacity: 0.6 }}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
            <CircularProgress size={14} />
            <Typography variant="caption">Assistant is typing...</Typography>
          </Box>
        )}

        <Box ref={messagesEndRef} />
      </Paper>

      <Divider sx={{ mb: 1 }} />

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          inputRef={inputRef}
          id="chat-input"
          fullWidth
          size="small"
          label="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" onClick={sendMessage} disabled={loading}>
          Send
        </Button>
      </Stack>

      <Box sx={{ mb: 2 }}>
        <ChatbotHelpPanel
          onCommand={(cmd) => {
            setInput(cmd);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={async () => {
            await axios.delete(`http://localhost:5050/api/chat/${userId}`);
            setMessages([]);
          }}
        >
          Clear Chat
        </Button>
      </Box>
    </Box>
  );
}