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
                Bạn đã đăng nhập thành công vào hệ thống quản lý đơn hàng.
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
                                Quản lý Sản phẩm
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Tạo, chỉnh sửa và quản lý thông tin sản phẩm.
                            </Typography>
                            <Link href="/products" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Quản lý Sản phẩm
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quản lý Kho
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Cập nhật số lượng tồn kho cho các sản phẩm.
                            </Typography>
                            <Link href="/inventory" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="secondary" fullWidth>
                                    Quản lý Kho
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Lịch sử Kho
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Xem lịch sử thay đổi số lượng kho theo sản phẩm.
                            </Typography>
                            <Link href="/inventory-history" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="info" fullWidth>
                                    Lịch sử Kho
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
