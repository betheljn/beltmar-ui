import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Collapse,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

const statusColors = {
  success: 'success',
  error: 'error',
  pending: 'warning'
};

export default function AgentFeed() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [agents, setAgents] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const fetchLogs = async () => {
    const res = await axios.get('http://localhost:5050/api/logs');
    setLogs(res.data);

    // Extract agent names for filter dropdown
    const agentNames = [
      ...new Set(res.data.map((log) => log.agent?.name).filter(Boolean))
    ];
    setAgents(agentNames);
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (logId) => {
    setExpandedLogId((prev) => (prev === logId ? null : logId));
  };

  const filteredLogs =
    filter === 'all' ? logs : logs.filter((log) => log.agent?.name === filter);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        🧾 Agent Activity Feed
      </Typography>

      <FormControl size="small" sx={{ mb: 2, minWidth: 200 }}>
        <InputLabel>Filter by Agent</InputLabel>
        <Select
          value={filter}
          label="Filter by Agent"
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="all">All Agents</MenuItem>
          {agents.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {filteredLogs.map((log) => {
          const isExpanded = expandedLogId === log.id;
          const status = log.data?.status || 'pending';

          return (
            <Grid item xs={12} md={6} key={log.id}>
              <Card variant="outlined" sx={{ position: 'relative' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {log.agent?.name || 'Unknown Agent'} → {log.action}
                  </Typography>

                  <Chip
                    label={status}
                    color={statusColors[status] || 'default'}
                    size="small"
                    sx={{ mt: 1 }}
                  />

                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </Typography>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Typography
                      variant="body2"
                      sx={{ mt: 2, whiteSpace: 'pre-wrap', color: 'text.secondary' }}
                    >
                      {log.data?.error
                        ? `❌ ${log.data.error}`
                        : JSON.stringify(log.data, null, 2)}
                    </Typography>
                  </Collapse>

                  <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <IconButton size="small" onClick={() => toggleExpand(log.id)}>
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
