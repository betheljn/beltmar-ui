// src/pages/Campaigns.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Tabs,
  Tab
} from '@mui/material';
import { fetchCampaigns } from '../api/api';
import CampaignFormModal from '../components/CampaignFormModal';
import CampaignModal from '../components/CampaignModal';

const statusOptions = ['All', 'Draft', 'Scheduled', 'Active', 'Completed'];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const loadCampaigns = async () => {
      const res = await fetchCampaigns();
      setCampaigns(res.data);
    };
    loadCampaigns();
  }, []);

  const handleTabChange = (e, newValue) => {
    setFilterStatus(newValue);
  };

  const filteredCampaigns = campaigns.filter((c) =>
    filterStatus === 'All' ? true : c.status === filterStatus.toUpperCase()
  );

  return (
    <Box sx={{ p: 4 }}>
      {/* Top header & button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">🚀 Campaigns ({filteredCampaigns.length})</Typography>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          ➕ New Campaign Plan
        </Button>
      </Box>

      {/* Filter Tabs */}
      <Tabs
        value={filterStatus}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        {statusOptions.map((status) => (
          <Tab key={status} label={status} value={status} />
        ))}
      </Tabs>

      {/* Campaign list */}
      {filteredCampaigns.length === 0 ? (
        <Typography>No campaigns found for this status.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredCampaigns.map((camp) => (
            <Grid item xs={12} md={6} key={camp.id}>
              <Paper
                sx={{ p: 2, cursor: 'pointer' }}
                onClick={() => {
                  setSelectedCampaign(camp.id);
                  setModalOpen(true);
                }}
              >
                <Typography variant="h6">{camp.name}</Typography>
                <Typography variant="body2">
                  Platform: {camp.platform} | Status: {camp.status}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Goal: {camp.goal} | Budget: ${camp.budget}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modals */}
      <CampaignModal
        open={modalOpen}
        campaignId={selectedCampaign}
        handleClose={() => setModalOpen(false)}
      />

      <CampaignFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreated={() => {
          setFormOpen(false);
          // Optional: Refresh list
        }}
      />
    </Box>
  );
}
