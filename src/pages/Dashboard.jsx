import React, { useEffect, useState, useContext } from 'react';
import {
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { fetchStrategies, fetchCampaigns, fetchContent } from '../api/api';
import StrategyForm from '../components/StrategyForm';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const [strategies, setStrategies] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [content, setContent] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useContext(AuthContext);
  const [loadingType, setLoadingType] = useState(null); // 'campaign' | 'content' | null


  useEffect(() => {
    if (!user?.userId || !user?.token) return;

    const loadData = async () => {
      try {
        const [strat, camp, cont] = await Promise.all([
          fetchStrategies(),
          fetchCampaigns(),
          fetchContent()
        ]);

        setStrategies(strat.data);
        setCampaigns(camp.data);
        setContent(cont.data);
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
      }
    };

    loadData();
  }, [user]);

  const handleRunAgent = async (type) => {
    setLoadingType(type);
    try {
      await API.post(`/agents/run/${type}`, { userId: user.userId });
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
    } finally {
      setLoadingType(null);
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
        <Button variant="contained" onClick={() => setFormOpen(true)} disabled={!!loadingType}>
          ➕ Create Strategy
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleRunAgent('campaign')}
          disabled={loadingType !== null}
        >
          {loadingType === 'campaign' ? <CircularProgress size={20} color="inherit" /> : '▶️ Run Campaign Agent'}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleRunAgent('content')}
          disabled={loadingType !== null}
        >
          {loadingType === 'content' ? <CircularProgress size={20} color="inherit" /> : '📝 Run Content Agent'}
        </Button>
      </Stack>



      <StrategyForm open={formOpen} handleClose={() => setFormOpen(false)} userId={user?.userId} />

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


