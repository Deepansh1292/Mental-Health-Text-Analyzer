import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Mental Health Monitoring System
        </Typography>
        <Typography variant="body1" paragraph>
          This platform helps monitor mental health conditions through social media content analysis.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 