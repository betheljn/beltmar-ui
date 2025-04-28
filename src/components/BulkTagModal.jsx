import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Chip, Stack, Typography
} from '@mui/material';

export default function BulkTagModal({ open, onClose, onSave, selectedCount }) {
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const handleAddTag = () => {
    const newTags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t && !tags.includes(t));
    setTags(prev => [...prev, ...newTags]);
    setTagInput('');
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(prev => prev.filter(tag => tag !== tagToDelete));
  };

  const handleSave = () => {
    const trimmedTags = tags.map(t => t.trim()).filter(Boolean);
    onSave(trimmedTags);
    setTags([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>🏷️ Bulk Tag Content</DialogTitle>
      <DialogContent>
        <Typography mb={2}>
          You’re tagging <strong>{selectedCount}</strong> content item(s).
        </Typography>

        <Stack direction="row" spacing={1} mb={2}>
          <TextField
            label="Add Tags (comma separated)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddTag} disabled={!tagInput.trim()}>
            Add
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          disabled={tags.length === 0}
          variant="contained"
        >
          Save Tags
        </Button>
      </DialogActions>
    </Dialog>
  );
}