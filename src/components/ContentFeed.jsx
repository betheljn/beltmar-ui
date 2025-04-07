// src/components/ContentFeed.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Stack
} from '@mui/material';
import axios from 'axios';

export default function ContentFeed() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/content');
        setContent(res.data);
      } catch (err) {
        console.error('Failed to fetch content:', err);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  if (loading) return <CircularProgress />;

  if (content.length === 0) {
    return <Typography>No content generated yet.</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Generated Content Assets
      </Typography>

      <Stack spacing={2}>
        {content.map((item) => (
          <Paper key={item.id} sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Campaign: {item.campaign?.name || 'Unknown'}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{item.content}</Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'gray' }}>
              Created: {new Date(item.createdAt).toLocaleString()}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
