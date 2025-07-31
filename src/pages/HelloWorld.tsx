import React from 'react';
import { BuilderComponent, builder } from '@builder.io/react';
import { Box, Typography, Paper, Container } from '@mui/material';
import '../builder-registry'; // Import to register components

// Initialize Builder.io with API key
builder.init(import.meta.env.VITE_BUILDER_PUBLIC_API_KEY || 'your-api-key-here');

const HelloWorldPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            Hello World Builder.io Page
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            This page demonstrates Builder.io integration with Material-UI
          </Typography>
        </Box>

        {/* Builder.io Content Area */}
        <Box sx={{ 
          minHeight: '400px',
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 2,
          backgroundColor: '#f8f9fa'
        }}>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
            Builder.io Content Area
          </Typography>
          
          <BuilderComponent 
            model="page" 
            content={null}
            data={{
              title: "Welcome to Builder.io!",
              description: "This content can be edited in the Builder.io visual editor"
            }}
          >
            {/* Fallback content when no Builder.io content is available */}
            <Box textAlign="center" py={4}>
              <Typography variant="h4" component="h2" gutterBottom>
                Hello World! 🌍
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Welcome to your Builder.io powered application!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                To customize this content:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                1. Set up your Builder.io API key in the .env file
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. Create content in your Builder.io dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3. Publish the content to see it here
              </Typography>
            </Box>
          </BuilderComponent>
        </Box>

        {/* Static Hello World Section */}
        <Box mt={4} textAlign="center">
          <Typography variant="h5" component="h3" gutterBottom>
            Static Hello World Section
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is a static section that showcases the Material-UI integration.
            The section above can be edited through Builder.io's visual editor.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default HelloWorldPage;
