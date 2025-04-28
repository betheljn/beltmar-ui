import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  Stack,
  MenuItem,
  Select,
  Paper,
  CircularProgress,
  Pagination,
  Divider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { fetchAgentLogs } from '../api/api';
import dayjs from 'dayjs';

export default function AgentLogList() {
  const [logs, setLogs] = useState([]);
  const [agentType, setAgentType] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [detailedView, setDetailedView] = useState(false);

  const limit = 10;

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAgentLogs({ page, limit, agentType });
      setLogs(res.data.logs);
      setTotalPages(Math.ceil(res.data.total / limit)); // Optional: subtract ChatbotAgent count if needed
    } catch (err) {
      console.error('❌ Failed to fetch logs', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, agentType]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const groupedLogs = logs.reduce((groups, log) => {
    const type = log.agent?.agentType || 'Unknown';
    if (!groups[type]) groups[type] = [];
    groups[type].push(log);
    return groups;
  }, {});

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Recent Agent Logs
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography>Filter:</Typography>
        <Select
          value={agentType}
          onChange={(e) => {
            setAgentType(e.target.value);
            setPage(1);
          }}
          size="small"
          displayEmpty
        >
          <MenuItem value="">All Agents</MenuItem>
          <MenuItem value="CampaignAgent">Campaign Agent</MenuItem>
          <MenuItem value="ContentAgent">Content Agent</MenuItem>
        </Select>

        <FormControlLabel
          control={
            <Switch
              checked={detailedView}
              onChange={(e) => setDetailedView(e.target.checked)}
              size="small"
            />
          }
          label="Detailed View"
        />
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : logs.length === 0 ? (
        <Typography>No recent agent logs.</Typography>
      ) : (
        <Stack spacing={3}>
          {Object.entries(groupedLogs).map(([type, group]) => (
            <Box key={type}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                🔹 {type}
              </Typography>

              <Stack spacing={2}>
                {group.map((log) => (
                  <Paper key={log.id} sx={{ p: 2 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {log.agent?.name || 'Unnamed Agent'}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {dayjs(log.createdAt).format('MMM D, YYYY h:mm A')} | Status: {log.status}
                      </Typography>

                      {detailedView && (
                        <>
                          {log.message && (
                            <>
                              <Divider sx={{ my: 1 }} />
                              <Typography variant="body2">
                                <strong>🔧 Message:</strong> {log.message}
                              </Typography>
                            </>
                          )}
                          {log.data?.model && (
                            <Typography variant="caption" color="text.secondary">
                              Model: {log.data.model}
                            </Typography>
                          )}
                        </>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>
          ))}

          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}
