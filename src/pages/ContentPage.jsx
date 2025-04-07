import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { fetchContent } from '../api/api';

export default function ContentPage() {
  const [content, setContent] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchContent();
        console.log('Fetched content:', res.data);
        setContent(res.data);
      } catch (err) {
        console.error('Failed to fetch content:', err);
      }
    };
    load();
  }, []);


  const toggleExpanded = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const filteredContent =
    typeFilter === 'all'
      ? content
      : content.filter((item) => item.type === typeFilter);

  const uniqueTypes = ['all', ...new Set(content.map((item) => item.type).filter(Boolean))];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Content Assets
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Filter by Type</InputLabel>
        <Select
          value={typeFilter}
          label="Filter by Type"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {uniqueTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type === 'all' ? 'All Types' : type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filteredContent.length === 0 && (
        <Typography variant="body2">No content found.</Typography>
      )}

      {filteredContent.map((item) => {
        const isExpanded = expandedIds.includes(item.id);
        const preview = item.content?.slice(0, 250);
        const showToggle = item.content?.length > 250;

        return (
          <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {item.type || 'Untitled Content'}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Campaign: {item.campaign?.name || 'N/A'}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
              Created: {new Date(item.createdAt).toLocaleString()}
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 1, whiteSpace: 'pre-line' }}
            >
              {isExpanded || !showToggle ? item.content : preview + '...'}
            </Typography>

            {showToggle && (
              <Button
                size="small"
                onClick={() => toggleExpanded(item.id)}
                sx={{ mt: 1 }}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
            )}

            <Button
              size="small"
              variant="outlined"
              onClick={() => navigator.clipboard.writeText(item.content)}
              sx={{ mt: 1, ml: 2 }}
            >
              Copy
            </Button>
          </Paper>
        );
      })}
    </Box>
  );
}
