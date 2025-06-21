"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { auth } from "@/lib/auth";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is authenticated
        const authenticated = auth.isAuthenticated();
        const currentUsername = auth.getUsername();
        setIsAuthenticated(authenticated);
        setUsername(currentUsername);

        if (!authenticated) {
            window.location.href = "/login";
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
                    <Typography variant="h6" component="div" sx={{ mr: 3 }}>
                        Ứng dụng Đặt hàng
                    </Typography>
                    
                    {/* Navigation Buttons */}
                    <Button 
                        color="inherit" 
                        component={Link} 
                        href="/dashboard"
                        sx={{ mr: 1 }}
                    >
                        Bảng điều khiển
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        href="/products"
                        sx={{ mr: 1 }}
                    >
                        Sản phẩm
                    </Button>
                    
                    <Typography variant="body1" sx={{ ml: "auto", mr: 2 }}>
                        Chào mừng, {username || "Người dùng"}!
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </Toolbar>
            </AppBar>

            {children}
        </>
    );
} 