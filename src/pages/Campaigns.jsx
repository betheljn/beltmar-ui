// src/pages/Campaigns.jsx

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box
} from '@mui/material';
import { fetchCampaigns } from '../api/api';
import CampaignModal from '../components/CampaignModal';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadCampaigns = async () => {
      const res = await fetchCampaigns();
      setCampaigns(res.data);
    };
    loadCampaigns();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        🚀 Campaigns ({campaigns.length})
      </Typography>

      <Grid container spacing={2}>
        {campaigns.map((camp) => (
          <Grid item xs={12} md={6} key={camp.id}>
            <Paper
              sx={{ p: 2, cursor: 'pointer' }}
              onClick={() => {
                setSelectedCampaign(camp.id);
                setModalOpen(true);
              }}
            >
              <Typography variant="h6">{camp.name}</Typography>
              <Typography variant="body2">{camp.platform}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Goal: {camp.goal} | Budget: ${camp.budget}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <CampaignModal
        open={modalOpen}
        campaignId={selectedCampaign}
        handleClose={() => setModalOpen(false)}
      />
    </Box>
  );
}
