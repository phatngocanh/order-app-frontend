"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ordersApi } from "@/lib/orders";
import { OrderResponse } from "@/types";
import { Add as AddIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersApi.getAll();
            setOrders(response.orders);
        } catch (err) {
            setError("Không thể tải danh sách đơn hàng");
            console.error("Error loading orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "warning";
            case "DELIVERED":
                return "success";
            case "UNPAID":
                return "info";
            case "COMPLETED":
                return "primary";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Chờ xử lý";
            case "DELIVERED":
                return "Đã giao hàng";
            case "UNPAID":
                return "Chưa thanh toán";
            case "COMPLETED":
                return "Hoàn thành";
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Đang tải...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
                <Button onClick={loadOrders} sx={{ mt: 2 }}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Quản lý Đơn hàng
                </Typography>
                <Button
                    component={Link}
                    href="/orders/create"
                    variant="contained"
                    startIcon={<AddIcon />}
                >
                    Tạo đơn hàng mới
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Khách hàng</TableCell>
                            <TableCell>Ngày đặt</TableCell>
                            <TableCell>Trạng thái giao hàng</TableCell>
                            <TableCell>Trạng thái công nợ</TableCell>
                            <TableCell>Số lượng sản phẩm</TableCell>
                            <TableCell>Tổng tiền</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography variant="body2" color="textSecondary">
                                        Chưa có đơn hàng nào
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer.name}</TableCell>
                                    <TableCell>{formatDate(order.order_date)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={getStatusLabel(order.delivery_status)}
                                            color={getStatusColor(order.delivery_status) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.debt_status}
                                            color={getStatusColor(order.debt_status) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{order.product_count ?? '-'}</TableCell>
                                    <TableCell>
                                        {(order.total_amount ?? 0).toLocaleString("vi-VN")} VND
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            component={Link}
                                            href={`/orders/${order.id}`}
                                            size="small"
                                            variant="outlined"
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
} 