import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import WavingHandIcon from '@mui/icons-material/WavingHand';

interface CustomGreetingProps {
  title?: string;
  message?: string;
  showIcon?: boolean;
  backgroundColor?: string;
}

const CustomGreeting: React.FC<CustomGreetingProps> = ({
  title = 'Hello World',
  message = 'Welcome to our amazing application!',
  showIcon = true,
  backgroundColor = '#f5f5f5'
}) => {
  return (
    <Card 
      sx={{ 
        backgroundColor,
        borderRadius: 2,
        boxShadow: 3,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ textAlign: 'center', py: 4 }}>
        {showIcon && (
          <Box sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', width: 64, height: 64 }}>
              <WavingHandIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
        )}
        <Typography variant="h4" component="h2" gutterBottom color="primary">
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomGreeting;
