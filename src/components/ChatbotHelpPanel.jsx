import React from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';

const CHAT_COMMANDS = [
  { label: '🛠 Generate Content', command: 'generate content' },
  { label: '📣 Run Campaign', command: 'run campaign' },
  { label: '📋 Show My Strategies', command: 'show my strategies' },
  { label: '👥 List Agents', command: 'list agents' },
  { label: '❓ Help', command: 'help' }
];

export default function ChatbotHelpPanel({ onCommand }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
        Chatbot Commands
      </Typography>
      <Stack spacing={1}>
        {CHAT_COMMANDS.map((cmd) => (
          <Button
            key={cmd.command}
            variant="outlined"
            onClick={() => onCommand(cmd.command)}
            fullWidth
          >
            {cmd.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
