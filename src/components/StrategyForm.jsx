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
import axios from 'axios';

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
      await axios.post('http://localhost:5050/api/strategy/generate', form);
      setSnack({ open: true, message: '🎯 Strategy created and agents triggered!', severity: 'success' });
      setForm({ goal: '', industry: '', audience: '', budget: '', level: 'beginner' });
      handleClose();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: '❌ Failed to create strategy', severity: 'error' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>➕ Create New Strategy</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField name="goal" label="Goal" value={form.goal} onChange={handleChange} fullWidth />
            <TextField name="industry" label="Industry" value={form.industry} onChange={handleChange} fullWidth />
            <TextField name="audience" label="Target Audience" value={form.audience} onChange={handleChange} fullWidth />
            <TextField name="budget" label="Budget ($)" type="number" value={form.budget} onChange={handleChange} fullWidth />
            <TextField select name="level" label="Experience Level" value={form.level} onChange={handleChange} fullWidth>
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

