import * as React from 'react';
import { Content, fetchOneEntry, isPreviewing } from '@builder.io/sdk-react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';

// You'll need to set your Builder.io API key here
// For now, using a placeholder - replace with your actual API key
const BUILDER_API_KEY = process.env.REACT_APP_BUILDER_API_KEY || 'YOUR_BUILDER_API_KEY_HERE';

interface HelloWorldProps {
  // Add any additional props if needed
}

export default function HelloWorld(props: HelloWorldProps) {
  const [builderContent, setBuilderContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch content from Builder.io for the hello world page
        const content = await fetchOneEntry({
          apiKey: BUILDER_API_KEY,
          model: 'page',
          userAttributes: {
            urlPath: '/hello-world'
          }
        });
        setBuilderContent(content);
      } catch (error) {
        console.error('Error fetching Builder.io content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="body1">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
            Hello World! 🌍
          </Typography>
          
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
            Welcome to your Builder.io Hello World Page
          </Typography>

          {/* Static content that's always shown */}
          <Box sx={{ mb: 4, p: 3, backgroundColor: 'background.default', borderRadius: 2 }}>
            <Typography variant="body1" paragraph>
              This is a simple hello world page built with:
            </Typography>
            <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
              <li>⚛️ React</li>
              <li>🏗️ Vite</li>
              <li>🎨 Material-UI</li>
              <li>📝 TypeScript</li>
              <li>🏗️ Builder.io CMS</li>
            </Typography>
          </Box>

          {/* Builder.io content section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Dynamic Content from Builder.io
            </Typography>
            
            {builderContent || isPreviewing() ? (
              <Content
                apiKey={BUILDER_API_KEY}
                model="page"
                content={builderContent}
              />
            ) : (
              <Box sx={{ p: 3, backgroundColor: 'info.main', color: 'info.contrastText', borderRadius: 1 }}>
                <Typography variant="body2">
                  📝 <strong>Setup Instructions:</strong>
                </Typography>
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                  1. Sign up at <a href="https://builder.io" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>builder.io</a><br/>
                  2. Get your API key from Builder.io settings<br/>
                  3. Set REACT_APP_BUILDER_API_KEY in your .env file<br/>
                  4. Create content for the '/hello-world' path in Builder.io<br/>
                  5. Refresh this page to see your dynamic content!
                </Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" align="center" color="text.secondary">
              Built with ❤️ using Material-UI, Vite, and Builder.io
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
