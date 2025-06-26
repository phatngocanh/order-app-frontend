"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import LoadingButton from "@/components/LoadingButton";
import SkeletonLoader from "@/components/SkeletonLoader";
import { ordersApi } from "@/lib/orders";
import { OrderResponse } from "@/types";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<OrderResponse | null>(null);
    const [deleting, setDeleting] = useState(false);

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

    const handleDeleteClick = (order: OrderResponse) => {
        setOrderToDelete(order);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!orderToDelete) return;

        try {
            setDeleting(true);
            await ordersApi.delete(orderToDelete.id);
            
            // Remove the deleted order from the list
            setOrders(orders.filter(order => order.id !== orderToDelete.id));
            
            // Close dialog and reset state
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
        } catch (err) {
            setError("Không thể xóa đơn hàng");
            console.error("Error deleting order:", err);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setOrderToDelete(null);
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
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Quản lý Đơn hàng
                    </Typography>
                    <Button
                        component={Link}
                        href="/orders/create"
                        variant="contained"
                        startIcon={<AddIcon />}
                        disabled
                    >
                        Tạo đơn hàng mới
                    </Button>
                </Box>
                <Paper>
                    <SkeletonLoader type="table" rows={8} columns={8} />
                </Paper>
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
                                        {order.debt_status || '-'}
                                    </TableCell>
                                    <TableCell>{order.product_count ?? '-'}</TableCell>
                                    <TableCell>
                                        {(order.total_amount ?? 0).toLocaleString("vi-VN")} VND
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                component={Link}
                                                href={`/orders/${order.id}`}
                                                size="small"
                                                variant="outlined"
                                            >
                                                Xem chi tiết
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteClick(order)}
                                            >
                                                Xóa
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Xác nhận xóa đơn hàng
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa đơn hàng #{orderToDelete?.id}? 
                        Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleting}>
                        Hủy
                    </Button>
                    <LoadingButton
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        loading={deleting}
                        loadingText="Đang xóa..."
                    >
                        Xóa
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 