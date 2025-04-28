import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, TextField, Stack
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function LaunchCampaignModal({ open, onClose, onLaunch, campaign }) {
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledAt, setScheduledAt] = useState(new Date());

  const handleLaunch = () => {
    const payload = scheduleLater ? { scheduledAt } : {};
    onLaunch(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>🚀 Launch Campaign</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            <strong>{campaign?.name}</strong>
          </Typography>
          <Typography variant="body2">
            This will generate and publish content for <em>{campaign?.platform}</em> using AI.
          </Typography>

          {scheduleLater && (
            <DateTimePicker
              label="Schedule Launch"
              value={scheduledAt}
              onChange={setScheduledAt}
              renderInput={(params) => <TextField {...params} />}
              minDateTime={new Date()}
            />
          )}

          <Button
            variant="outlined"
            onClick={() => setScheduleLater(!scheduleLater)}
          >
            {scheduleLater ? '⬅️ Back to Launch Now' : '📅 Schedule for Later'}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleLaunch}>
          {scheduleLater ? 'Schedule Launch' : 'Launch Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
