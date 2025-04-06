// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Snackbar,
  Alert
} from '@mui/material';
import { fetchStrategies, fetchCampaigns, fetchContent } from '../api/api';
import StrategyForm from '../components/StrategyForm';
import axios from 'axios';

export default function Dashboard() {
  const [strategies, setStrategies] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [content, setContent] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const loadData = async () => {
      const strat = await fetchStrategies();
      const camp = await fetchCampaigns();
      const cont = await fetchContent();
      setStrategies(strat.data);
      setCampaigns(camp.data);
      setContent(cont.data);
    };
    loadData();
  }, []);

  const handleRunAgent = async (type) => {
    try {
      await axios.post(`http://localhost:5050/api/agents/run/${type}`);
      setSnack({
        open: true,
        message: `${type === 'campaign' ? 'Campaign Agent' : 'Content Agent'} triggered successfully!`,
        severity: 'success'
      });
    } catch {
      setSnack({
        open: true,
        message: `Failed to run ${type} agent.`,
        severity: 'error'
      });
    }
  };

  const StatBox = ({ label, count }) => (
    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6">{label}</Typography>
      <Typography variant="h4">{count}</Typography>
    </Paper>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Beltmar Agent Dashboard
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          ➕ Create Strategy
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleRunAgent('campaign')}>
          ▶️ Run Campaign Agent
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleRunAgent('content')}>
          📝 Run Content Agent
        </Button>
      </Stack>

      <StrategyForm open={formOpen} handleClose={() => setFormOpen(false)} />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatBox label="🧠 Strategies" count={strategies.length} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox label="🚀 Campaigns" count={campaigns.length} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatBox label="✍️ Content Assets" count={content.length} />
        </Grid>
      </Grid>

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
    </Box>
  );
}


