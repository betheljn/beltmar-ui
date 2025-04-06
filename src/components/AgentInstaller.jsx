import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Chip,
  Divider
} from '@mui/material';
import axios from 'axios';

const AGENT_TEMPLATES = [
  {
    name: 'Generic Marketing Agent',
    role: 'strategy',
    tags: ['generic', 'multi-channel'],
    description:
      'Handles overall marketing strategy, from social posts to funnels.',
    tasks: ['social media', 'lead gen', 'email marketing'],
    triggers: ['onboarding']
  },
  {
    name: 'E-commerce Agent',
    role: 'automation',
    tags: ['ecommerce'],
    description:
      'Built for online stores — automates customer engagement and promotions.',
    tasks: ['inventory updates', 'promo emails', 'order tracking'],
    triggers: ['new product', 'customer checkout']
  },
  {
    name: 'Content Agent',
    role: 'content',
    tags: ['content', 'creation'],
    description: 'Creates blog posts, email content, and ad copy.',
    tasks: ['write content', 'schedule posts'],
    triggers: ['campaign launched']
  }
];

export default function AgentTemplateInstaller() {
  const handleInstall = async (template) => {
    const payload = {
      name: template.name,
      role: template.role,
      industryTags: template.tags,
      inputs: ['goal', 'audience'],
      outputs: ['campaigns', 'content'],
      tasks: template.tasks,
      triggers: template.triggers,
      configOptions: { tone: 'casual' },
      feedbackEnabled: true
    };

    try {
      await axios.post('http://localhost:5050/api/agents', payload);
      alert(`${template.name} installed!`);
    } catch {
      alert('Error installing agent');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        🛠️ Install Agent Templates
      </Typography>
      <Grid container spacing={3}>
        {AGENT_TEMPLATES.map((template) => (
          <Grid item xs={12} md={6} key={template.name}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{template.name}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {template.description}
              </Typography>
              <Chip label={`Role: ${template.role}`} size="small" />
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                Tasks:
              </Typography>{' '}
              {template.tasks.join(', ')}
              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={() => handleInstall(template)}
                >
                  Install Agent
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
