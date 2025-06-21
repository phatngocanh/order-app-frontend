"use client";

import Link from "next/link";

import { Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

export default function DashboardPage() {
    return (
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
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                The following features are now available:
                            </Typography>
                            <Link href="/products" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Products Management
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
