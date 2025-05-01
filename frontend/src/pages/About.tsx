import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from '@mui/material';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Resham Hansdah',
      role: 'Lead Developer',
      github: 'https://github.com/Resham0007',
    },
    {
      name: 'Sonali Kishan',
      role: 'ML Engineer',
      github: 'https://github.com/sonalikishan',
    },
    {
      name: 'Subham Beura',
      role: 'Data Scientist',
      github: 'https://github.com/Subham-Beura/Subham-Beura',
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          About the Project
        </Typography>
        <Typography variant="body1" paragraph>
          This project aims to leverage natural language processing (NLP) techniques to analyze social media posts,
          particularly tweets from Twitter, to detect signs of mental health conditions and identify individuals
          at risk of suicidal ideation.
        </Typography>
        <Typography variant="body1" paragraph>
          By harnessing the power of social media data, we seek to provide early interventions and support
          for those in distress. Our system uses advanced machine learning models, including CNN-BiLSTM,
          to analyze text and detect patterns associated with mental health conditions.
        </Typography>
      </Paper>

      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Key Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Machine Learning Models
            </Typography>
            <Typography variant="body1" paragraph>
              • CNN-BiLSTM for text classification
              • K-Fold Cross-Validation for robust results
              • Real-time analysis capabilities
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Analysis Capabilities
            </Typography>
            <Typography variant="body1" paragraph>
              • Detection of depression and suicidal ideation
              • Risk level assessment
              • Personalized recommendations
              • Privacy-focused processing
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Our Team
        </Typography>
        <Grid container spacing={3}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card>
                <CardHeader
                  avatar={
                    <Avatar
                      src={`https://github.com/${member.github.split('/').pop()}.png`}
                      alt={member.name}
                    />
                  }
                  title={member.name}
                  subheader={member.role}
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                      GitHub Profile
                    </a>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default About; 