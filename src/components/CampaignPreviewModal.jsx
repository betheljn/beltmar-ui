import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import API from '../api/api';

export default function CampaignPreviewModal({ open, onClose, formData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchPreview = async () => {
    try {
      setLoading(true);
      setSaved(false);
      const res = await API.post('/campaigns/preview', formData);
      setPreviewText(res.data.preview);
    } catch (err) {
      console.error('❌ AI Preview Error:', err);
      setPreviewText('⚠️ Failed to generate preview.');
    } finally {
      setLoading(false);
    }
  };

  const savePreviewContent = async () => {
    if (!formData.id) {
      console.warn('⛔ Cannot save preview: Campaign ID missing.');
      setSaved(false);
      return;
    }
    try {
      await API.put(`/campaigns/${formData.id}/status`, {
        content: previewText
      });
      setSaved(true);
      setIsEditing(false);
    } catch (err) {
      console.error('❌ Failed to save preview content:', err);
    }
  };  

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setSaved(false);
  };

  React.useEffect(() => {
    if (open) fetchPreview();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>🤖 AI Content Preview</DialogTitle>
      <DialogContent>
        <Box sx={{ backgroundColor: '#f9f9f9', p: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            {formData.name}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Platform: {formData.platform} | Tone: {formData.tone}
          </Typography>
          <Divider sx={{ my: 1 }} />
          {isEditing ? (
            <TextField
              multiline
              fullWidth
              minRows={10}
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              sx={{ mb: 2 }}
            />
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {previewText}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {formData.hashtags?.split(',').map((tag) => (
              <Chip key={tag} label={`#${tag.trim()}`} variant="outlined" />
            ))}
            {formData.callToAction && (
              <Chip color="primary" label={`CTA: ${formData.callToAction}`} />
            )}
          </Stack>
        </Box>
        {saved && (
          <Typography color="success.main" sx={{ mt: 1 }}>
            ✅ Content saved successfully.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {isEditing ? (
          <>
            <Button onClick={handleEditToggle}>Cancel Edit</Button>
            <Button
            onClick={savePreviewContent}
            variant="contained"
            color="primary"
            disabled={!formData.id}
            >
            Save Content
            </Button>
          </>
        ) : (
          <Button onClick={handleEditToggle} variant="outlined">
            ✏️ Edit
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

