'use client';

import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { auth } from '@/lib/auth';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = auth.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (!authenticated) {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    auth.logout();
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Order App Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to the Dashboard
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          You have successfully logged in to the system.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Authentication Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You are currently authenticated and can access the system.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Available Features
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Currently only login functionality is available. More features will be added as the backend API expands.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
} 