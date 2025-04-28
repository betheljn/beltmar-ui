import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, MenuItem, Snackbar, Alert
} from '@mui/material';
import { updateContent, regenerateContentAI } from '../api/api';

const tones = ['Neutral', 'Friendly', 'Professional', 'Urgent'];

export default function EditContentModal({ open, onClose, content, onSave }) {
  const [form, setForm] = useState({ ...content });
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (content) setForm({ ...content });
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateContent(content.id, form);
      setSnack({ open: true, message: '✅ Content updated!', severity: 'success' });
      onSave();
    } catch (err) {
      console.error('❌ Failed to update content:', err);
      setSnack({ open: true, message: 'Failed to update', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAIRegenerate = async () => {
    try {
      const result = await regenerateContentAI(form); // Call your endpoint
      setForm(prev => ({ ...prev, content: result.preview }));
      setSnack({ open: true, message: '✅ AI content regenerated', severity: 'success' });
    } catch (err) {
      console.error('❌ AI generation failed:', err);
      setSnack({ open: true, message: 'AI generation failed', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>✏️ Edit Content</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Content"
              name="content"
              multiline
              rows={6}
              value={form.content}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              label="Tone"
              name="tone"
              value={form.tone || ''}
              onChange={handleChange}
              fullWidth
            >
              {tones.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Call to Action"
              name="callToAction"
              value={form.callToAction || ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Hashtags"
              name="hashtags"
              value={form.hashtags?.join(', ') || ''}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, hashtags: e.target.value.split(',').map(h => h.trim()) }))
              }
              fullWidth
              placeholder="e.g. marketing,startup,ai"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="outlined" onClick={handleAIRegenerate}>🔁 Regenerate with AI</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}