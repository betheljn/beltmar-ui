// components/ContentFormModal.jsx

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, Stack, Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import API from '../api/api';

const types = ['social', 'email', 'ad'];
const tones = ['Neutral', 'Friendly', 'Professional', 'Urgent'];

export default function ContentFormModal({ open, onClose, campaigns = [], onCreated }) {
  const [form, setForm] = useState({
    type: 'social',
    campaignId: '',
    content: '',
    tone: 'Neutral',
    hashtags: '',
    callToAction: '',
    platform: '',
    mediaUrl: '',
    mediaType: '',
    tags: '',
    scheduledAt: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()),
        hashtags: form.hashtags.split(',').map(t => t.trim()),
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
      };
      const res = await API.post('api/content', payload);
      onCreated(res.data);
      onClose();
    } catch (err) {
      console.error('❌ Failed to create content:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateWithAI = async () => {
    try {
      setLoading(true);
      const response = await API.post('/content/preview', {
        campaignId: form.campaignId,
        tone: form.tone,
        type: form.type,
        hashtags: form.hashtags,
        callToAction: form.callToAction,
        platform: form.platform
      });
      setForm((prev) => ({ ...prev, content: response.data.preview || '⚠️ AI failed to generate content.' }));
    } catch (error) {
      console.error('❌ AI Generation Error:', error);
      setForm((prev) => ({ ...prev, content: '⚠️ AI failed to generate content.' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>✍️ Create New Content</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField select label="Content Type" name="type" value={form.type} onChange={handleChange}>
            {types.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>

          <TextField select label="Linked Campaign" name="campaignId" value={form.campaignId} onChange={handleChange}>
            <MenuItem value="" disabled>Select campaign</MenuItem>
            {campaigns.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>

          <TextField
            label="Content"
            name="content"
            value={form.content}
            onChange={handleChange}
            multiline
            minRows={6}
            fullWidth
          />

          <TextField select label="Tone" name="tone" value={form.tone} onChange={handleChange}>
            {tones.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>

          <TextField label="Hashtags (comma-separated)" name="hashtags" value={form.hashtags} onChange={handleChange} />
          <TextField label="Tags (comma-separated)" name="tags" value={form.tags} onChange={handleChange} />
          <TextField label="Call to Action" name="callToAction" value={form.callToAction} onChange={handleChange} />
          <TextField label="Platform" name="platform" value={form.platform} onChange={handleChange} />
          <TextField label="Media URL" name="mediaUrl" value={form.mediaUrl} onChange={handleChange} />
          <TextField label="Media Type (image, video, etc)" name="mediaType" value={form.mediaType} onChange={handleChange} />
          <DateTimePicker
            label="Schedule At (optional)"
            value={form.scheduledAt}
            onChange={(newValue) => setForm((prev) => ({ ...prev, scheduledAt: newValue }))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Create'}
        </Button>
        <Button onClick={generateWithAI} disabled={loading}>
        🤖 Generate with AI
        </Button>
      </DialogActions>
    </Dialog>
  );
}
