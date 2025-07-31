import React from 'react';
import { BuilderComponent, builder } from '@builder.io/react';
import { Box, Typography, Container } from '@mui/material';

// Initialize Builder with your public API key
// TODO: Add your Builder.io API key to environment variables
const BUILDER_API_KEY = import.meta.env.VITE_BUILDER_API_KEY || 'YOUR_API_KEY_HERE';

builder.init(BUILDER_API_KEY);

interface HelloWorldProps {}

const HelloWorld: React.FC<HelloWorldProps> = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Static Hello World Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Hello World!
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 3 }}>
            Welcome to our Builder.io integrated MUI Vite Demo
          </Typography>
        </Box>

        {/* Builder.io Dynamic Content Section */}
        <Box sx={{ minHeight: '400px' }}>
          <BuilderComponent 
            model="page" 
            content={null}
            apiKey={BUILDER_API_KEY}
            // Use hello-world as the URL path for Builder content
            options={{
              urlPath: '/hello-world'
            }}
          />
        </Box>

        {/* Fallback content when no Builder content is available */}
        <Box sx={{ textAlign: 'center', mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Dynamic Content Area
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This area will display content managed through Builder.io.
            Create content at builder.io for the "/hello-world" path to see it here.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default HelloWorld;
