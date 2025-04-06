import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  LinearProgress
} from '@mui/material';
import { fetchAgentStats } from '../api/api';

export default function AgentAnalytics() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchAgentStats();
      setStats(res.data);
    };
    load();
  }, []);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        📈 Agent Performance
      </Typography>
      <Grid container spacing={3}>
        {stats.map((agent) => {
          const successRate = agent.total
            ? (agent.successes / agent.total) * 100
            : 0;

          return (
            <Grid item xs={12} md={6} key={agent.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{agent.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Role: {agent.role}
                </Typography>
                <Typography variant="body2">
                  Successes: {agent.successes} | Failures: {agent.failures}
                </Typography>
                <Typography variant="body2">
                  Total Runs: {agent.total}
                </Typography>
                <Typography variant="body2">
                  Last Run: {agent.lastRun
                    ? new Date(agent.lastRun).toLocaleString()
                    : 'Never'}
                </Typography>

                <Box mt={1}>
                  <LinearProgress
                    variant="determinate"
                    value={successRate}
                    sx={{ height: 10, borderRadius: 2 }}
                  />
                  <Typography variant="caption">
                    Success Rate: {successRate.toFixed(1)}%
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
