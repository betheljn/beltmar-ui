import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  CircularProgress,
  Divider,
  Box,
  Grid
} from '@mui/material';
import { fetchCampaignById } from '../api/api';
import { deleteCampaignPlan } from '../api/api';
import { updateCampaignPlan } from '../api/api';

const platforms = ['Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'TikTok', 'Email'];

export default function CampaignModal({ open, handleClose, campaignId, onDeleted, onUpdated }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!campaignId) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchCampaignById(campaignId);
        setCampaign(res.data);
        setForm(res.data); // preload form
      } catch (err) {
        console.error('❌ Failed to fetch campaign details:', err.response?.data || err.message);
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [campaignId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedForm = {
        ...form,
        budget: parseInt(form.budget, 10), // convert string to number
      };
  
      await updateCampaignPlan(campaignId, updatedForm);
      alert('✅ Campaign updated!');
      onUpdated?.();
      handleClose();
    } catch (err) {
      console.error('❌ Save error:', err);
      alert('Failed to update campaign.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this campaign plan?');
    if (!confirmDelete) return;
  
    setDeleting(true);
    try {
      await deleteCampaignPlan(campaignId); // uses baseURL and auth token
  
      alert('✅ Campaign deleted.');
      onDeleted?.(); // callback to refresh parent list
      handleClose();
    } catch (err) {
      console.error('❌ Failed to delete campaign:', err);
      alert('Error deleting campaign.');
    } finally {
      setDeleting(false);
    }
  };  

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>📦 Campaign Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : !campaign ? (
          <Typography color="error">Failed to load campaign details.</Typography>
        ) : editing ? (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Campaign Name"
                name="name"
                fullWidth
                value={form.name || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Goal"
                name="goal"
                fullWidth
                value={form.goal || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Audience"
                name="audience"
                fullWidth
                value={form.audience || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Platform"
                name="platform"
                select
                fullWidth
                value={form.platform || ''}
                onChange={handleChange}
              >
                {platforms.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Budget"
                name="budget"
                type="number"
                fullWidth
                value={form.budget || ''}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Typography variant="h6">{campaign.name}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Platform: {campaign.platform} | Budget: ${campaign.budget}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" gutterBottom>
              <strong>🧠 Strategy Goal:</strong> {campaign.strategy?.goal || 'N/A'}
            </Typography>

            <Typography variant="body2" whiteSpace="pre-wrap">
              {campaign.content}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">✍️ Content Assets</Typography>
            {campaign.ContentAssets?.length ? (
              campaign.ContentAssets.map((asset, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">• {asset.type}</Typography>
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {asset.content}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No content assets yet.
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {editing ? (
          <>
            <Button onClick={() => setEditing(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleClose}>Close</Button>
            {campaign && campaign.status === 'DRAFT' && (
            <>
                <Button
                variant="outlined"
                onClick={() => setEditing(true)}
                >
                ✏️ Edit
                </Button>
                <Button
                variant="outlined"
                color="error"
                onClick={handleDelete}
                disabled={deleting}
                >
                {deleting ? 'Deleting...' : '🗑️ Delete'}
                </Button>
            </>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}