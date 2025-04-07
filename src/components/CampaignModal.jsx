import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
  Divider,
  Box
} from '@mui/material';
import { fetchCampaignById } from '../api/api';

export default function CampaignModal({ open, handleClose, campaignId }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;
  
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchCampaignById(campaignId);
        setCampaign(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch campaign details:', err.response?.data || err.message);
        setCampaign(null); // Ensure UI doesn't crash
      } finally {
        setLoading(false);
      }
    };
  
    load();
  }, [campaignId]);  

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>📦 Campaign Details</DialogTitle>
        <DialogContent>
            {loading ? (
            <CircularProgress />
            ) : !campaign ? (
            <Typography color="error">Failed to load campaign details.</Typography>
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
                {campaign.ContentAssets?.map((asset, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">• {asset.type}</Typography>
                    <Typography variant="body2" whiteSpace="pre-wrap">
                    {asset.content}
                    </Typography>
                </Box>
                ))}
            </Box>
            )}
        </DialogContent>
        </Dialog>
  );
}