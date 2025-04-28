import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import API from '../api/api';

const goals = [
  'Increase Brand Awareness',
  'Generate Leads',
  'Boost Engagement',
  'Drive Website Traffic',
  'Promote Product Launch',
  'Build Community',
  'Increase Sales',
];

const industries = [
  'Technology',
  'Health & Wellness',
  'E-Commerce',
  'Education',
  'Finance',
  'Real Estate',
  'Entertainment',
  'Non-Profit',
];

const audiences = [
  'Gen Z',
  'Millennials',
  'Parents',
  'Professionals',
  'Small Business Owners',
  'Students',
  'Retirees',
  'Investors',
];

export default function StrategyForm({ open, handleClose }) {
  const [form, setForm] = useState({
    goal: '',
    industry: '',
    audience: '',
    budget: '',
    level: 'beginner'
  });
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post('/strategy/generate', form);
      setSnack({ open: true, message: 'Strategy created and agents triggered!', severity: 'success' });
      setForm({ goal: '', industry: '', audience: '', budget: '', level: 'beginner' });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: 'Failed to create strategy', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>➕ Create New Strategy</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              name="goal"
              label="Marketing Goal"
              select
              fullWidth
              value={form.goal}
              onChange={handleChange}
            >
              <MenuItem value="" disabled>Select a goal</MenuItem>
              {goals.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </TextField>

            <TextField
              name="industry"
              label="Industry"
              select
              fullWidth
              value={form.industry}
              onChange={handleChange}
            >
              <MenuItem value="" disabled>Select an industry</MenuItem>
              {industries.map((i) => (
                <MenuItem key={i} value={i}>{i}</MenuItem>
              ))}
            </TextField>

            <TextField
              name="audience"
              label="Target Audience"
              select
              fullWidth
              value={form.audience}
              onChange={handleChange}
            >
              <MenuItem value="" disabled>Select an audience</MenuItem>
              {audiences.map((a) => (
                <MenuItem key={a} value={a}>{a}</MenuItem>
              ))}
            </TextField>

            <TextField
              name="budget"
              label="Budget ($)"
              type="number"
              value={form.budget}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              name="level"
              label="Experience Level"
              value={form.level}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Generate</Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}

