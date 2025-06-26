"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import LoadingSpinner from "@/components/LoadingSpinner";
import { customerApi } from "@/lib/customers";
import { ordersApi } from "@/lib/orders";
import { productApi } from "@/lib/products";
import { 
    Info as InfoIcon,
    Inventory as InventoryIcon,
    People as PeopleIcon,
    Receipt as ReceiptIcon,
    ShoppingCart as ShoppingCartIcon,
    TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { 
    Alert,
    Box,
    Button, 
    Card, 
    CardContent, 
    Container, 
    Grid, 
    Tooltip,
    Typography,
} from "@mui/material";

interface DashboardStats {
    totalProducts: number;
    totalCustomers: number;
    totalInventoryItems: number;
    lowStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        totalCustomers: 0,
        totalInventoryItems: 0,
        lowStockProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load products, customers, and orders in parallel
                const [products, customers, orders] = await Promise.all([
                    productApi.getAll(),
                    customerApi.getAll(),
                    ordersApi.getAll(),
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

                // Calculate order stats
                const pendingOrders = orders.orders.filter(order => 
                    order.delivery_status !== "COMPLETED"
                ).length;

                setStats({
                    totalProducts: products.length,
                    totalCustomers: customers.length,
                    totalInventoryItems,
                    lowStockProducts,
                    totalOrders: orders.orders.length,
                    pendingOrders,
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
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <LoadingSpinner 
                    message="Đang tải dữ liệu bảng điều khiển..." 
                    fullHeight={true}
                />
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
                            <ReceiptIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4" component="div">
                                {stats.totalOrders}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng đơn hàng
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
                                {stats.pendingOrders}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Đơn hàng chờ xử lý
                                </Typography>
                                <Tooltip title="Đơn hàng chưa hoàn thành (mọi trạng thái khác ngoài Hoàn thành)">
                                    <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                                </Tooltip>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <TrendingUpIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
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
                                Quản lý Đơn hàng
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Tạo và quản lý đơn hàng. Hiện có {stats.totalOrders} đơn hàng, trong đó {stats.pendingOrders} đơn đang chờ xử lý.
                            </Typography>
                            <Link href="/orders" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="success" fullWidth>
                                    Quản lý Đơn hàng
                                </Button>
                            </Link>
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