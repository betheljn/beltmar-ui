import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack
} from '@mui/material';
import { deleteContent } from '../api/api';

export default function DeleteConfirmationModal({ open, onClose, content, onDelete }) {
  const handleDelete = async () => {
    try {
      await deleteContent(content.id);
      onDelete(); // refresh or update list
    } catch (err) {
      console.error('❌ Error deleting content:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>🗑️ Confirm Deletion</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            Are you sure you want to delete this <strong>{content?.type}</strong> content from
            campaign <strong>{content?.campaign?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            "{content?.content?.slice(0, 100)}..."
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}