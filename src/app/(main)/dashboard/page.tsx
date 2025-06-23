"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { customerApi } from "@/lib/customers";
import { productApi } from "@/lib/products";
import { 
    Alert,
    Box,
    Button, 
    Card, 
    CardContent, 
    CircularProgress,
    Container, 
    Grid, 
    Tooltip,
    Typography,
} from "@mui/material";
import { 
    Info as InfoIcon,
    Inventory as InventoryIcon,
    People as PeopleIcon,
    ShoppingCart as ShoppingCartIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

interface DashboardStats {
    totalProducts: number;
    totalCustomers: number;
    totalInventoryItems: number;
    lowStockProducts: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalCustomers: 0,
        totalInventoryItems: 0,
        lowStockProducts: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load products and customers in parallel
                const [products, customers] = await Promise.all([
                    productApi.getAll(),
                    customerApi.getAll(),
                ]);

                // Calculate inventory stats
                let totalInventoryItems = 0;
                let lowStockProducts = 0;

                for (const product of products) {
                    try {
                        const inventory = await productApi.getInventory(product.id);
                        totalInventoryItems += inventory.quantity;
                        if (inventory.quantity < 10) { // Consider low stock if less than 10
                            lowStockProducts++;
                        }
                    } catch (err) {
                        console.error(`Error loading inventory for product ${product.id}:`, err);
                    }
                }

                setStats({
                    totalProducts: products.length,
                    totalCustomers: customers.length,
                    totalInventoryItems,
                    lowStockProducts,
                });
            } catch (err: any) {
                console.error("Error loading dashboard data:", err);
                setError("Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Đang tải dữ liệu...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Chào mừng đến Bảng điều khiển
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Tổng quan hệ thống quản lý đơn hàng của bạn.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" component="div">
                                {stats.totalProducts}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng sản phẩm
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <PeopleIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" component="div">
                                {stats.totalCustomers}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng khách hàng
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <InventoryIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" component="div">
                                {stats.totalInventoryItems}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng tồn kho
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <TrendingUpIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" component="div">
                                {stats.lowStockProducts}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Sản phẩm sắp hết
                                </Typography>
                                <Tooltip title="Sản phẩm có số lượng tồn kho dưới 10 đơn vị">
                                    <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Management Cards */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Quản lý Sản phẩm
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Tạo, chỉnh sửa và quản lý thông tin sản phẩm. Hiện có {stats.totalProducts} sản phẩm trong hệ thống.
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
                                Quản lý Khách hàng
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Quản lý thông tin khách hàng và danh sách liên hệ. Hiện có {stats.totalCustomers} khách hàng.
                            </Typography>
                            <Link href="/customers" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="secondary" fullWidth>
                                    Quản lý Khách hàng
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
                                Cập nhật số lượng tồn kho cho các sản phẩm. Tổng tồn kho: {stats.totalInventoryItems} đơn vị.
                            </Typography>
                            <Link href="/inventory" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="info" fullWidth>
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
                                Xem lịch sử thay đổi số lượng kho theo sản phẩm và theo dõi hoạt động nhập/xuất.
                            </Typography>
                            <Link href="/inventory-history" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="warning" fullWidth>
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
