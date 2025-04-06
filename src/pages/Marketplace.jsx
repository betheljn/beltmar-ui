// src/components/Marketplace.js

import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';

import AgentTemplateInstaller from '../components/AgentInstaller';

const Marketplace = () => {
  const [agents, setAgents] = useState([]);
  const [userId] = useState('user123'); // Example userId, replace with actual method to get logged-in user ID
  const [unlockedIds, setUnlockedIds] = useState([]);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/marketplace');
        setAgents(res.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const unlockAgent = async (agentId) => {
    try {
      await axios.post('http://localhost:5050/api/marketplace/unlock/' + agentId, {
        userId,
        premium: false,
      });
      setUnlockedIds(prev => [...prev, agentId]);
      alert('Agent unlocked successfully!');
    } catch (error) {
      console.error('Error unlocking agent:', error);
      alert('Failed to unlock agent.');
    }
  };

  return (
    <div>
      <Typography variant="h5">🧠 Available Agents for You</Typography>
      <Typography variant="body1" gutterBottom>
        Unlock agents to enhance your experience.
      </Typography>
      <AgentTemplateInstaller />
      <Typography variant="h6" gutterBottom>
        Available Agents
      </Typography>
      <Typography variant="body2" gutterBottom>
        Click on "Unlock Agent" to gain access.
      </Typography>
      <Typography variant="body2" gutterBottom>
        Note: Some agents may require additional permissions.
      </Typography>
      <Grid container spacing={2}>
        {agents.map((agent) => (
          <Grid item xs={12} sm={6} md={4} key={agent.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{agent.name}</Typography>
                <Typography variant="body2">{agent.role}</Typography>
                <Button
                onClick={() => unlockAgent(agent.id)}
                variant="contained"
                color="primary"
                disabled={unlockedIds.includes(agent.id)}
                >
                {unlockedIds.includes(agent.id) ? 'Unlocked' : 'Unlock Agent'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Marketplace;
