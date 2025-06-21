"use client";

import { useState } from "react";

import { ApiResponse, auth, LoginRequest, LoginResponse } from "@/lib/auth";
import { api } from "@/lib/axios";
import { Alert, Box, Button, CircularProgress,Container, Paper, TextField, Typography } from "@mui/material";

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginRequest>({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<ApiResponse<LoginResponse>>("/users/login", formData);

            if (response.data.success) {
                auth.setToken(response.data.data.token, response.data.data.username);
                window.location.href = "/dashboard";
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.errors?.[0]?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper sx={{ p: 4, width: "100%" }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        Login
                    </Typography>

                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Enter your credentials to access the system
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={formData.username}
                            onChange={handleInputChange("username")}
                            margin="normal"
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange("password")}
                            margin="normal"
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : "Login"}
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}
