import React from 'react';
import { BuilderComponent, builder } from '@builder.io/sdk-react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import '../builder-config';

const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

interface HelloWorldPageProps {
  builderContent?: any;
}

const HelloWorldPage: React.FC<HelloWorldPageProps> = ({ builderContent }) => {
  const [content, setContent] = React.useState(builderContent);
  const [loading, setLoading] = React.useState(!builderContent);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!builderContent) {
      // Fetch Builder.io content for hello-world page
      builder.get('page', { 
        url: '/hello-world',
        options: {
          includeRefs: true
        }
      })
        .promise()
        .then((content) => {
          setContent(content);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching Builder.io content:', err);
          setError('Failed to load content from Builder.io');
          setLoading(false);
        });
    }
  }, [builderContent]);

  if (loading) {
    return (
      <StyledContainer maxWidth="lg">
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="lg">
        <ErrorContainer>
          <Typography variant="h5" color="error" gutterBottom>
            Builder.io Content Error
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {error}
          </Typography>
        </ErrorContainer>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      {content ? (
        <BuilderComponent 
          model="page" 
          content={content}
        />
      ) : (
        <ErrorContainer>
          <Typography variant="h4" component="h1" gutterBottom>
            Hello World! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Welcome to Builder.io with Material-UI
          </Typography>
          <Typography variant="body1" paragraph>
            This is a default hello world page. To customize this content:
          </Typography>
          <Box component="ol" sx={{ textAlign: 'left', maxWidth: '600px', mx: 'auto' }}>
            <Typography component="li" variant="body2" paragraph>
              Sign up for Builder.io at{' '}
              <a href="https://builder.io" target="_blank" rel="noopener noreferrer">
                builder.io
              </a>
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Get your API key from your Builder.io account settings
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Update the VITE_BUILDER_API_KEY in your .env file
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Create a new page model in Builder.io with the URL "/hello-world"
            </Typography>
            <Typography component="li" variant="body2" paragraph>
              Start building your page content in the Builder.io visual editor!
            </Typography>
          </Box>
        </ErrorContainer>
      )}
    </StyledContainer>
  );
};

export default HelloWorldPage;
