"use client";

import Link from "next/link";

import { Button, Card, CardContent, Container, Grid, Typography } from "@mui/material";

export default function DashboardPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Chào mừng đến Bảng điều khiển
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Bạn đã đăng nhập thành công vào hệ thống.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Trạng thái Xác thực
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Bạn hiện đang được xác thực và có thể truy cập hệ thống.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tính năng Có sẵn
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Các tính năng sau hiện có sẵn:
                            </Typography>
                            <Link href="/products" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Quản lý Sản phẩm
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
