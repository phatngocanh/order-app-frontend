"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ordersApi } from "@/lib/orders";
import { OrderResponse, UpdateOrderRequest } from "@/types";
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = parseInt(params.orderId as string);

    const [order, setOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editType, setEditType] = useState<'delivery' | 'debt'>('delivery');
    const [editStatus, setEditStatus] = useState('');

    useEffect(() => {
        if (orderId) {
            loadOrder();
        }
    }, [orderId]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const response = await ordersApi.getOne(orderId);
            setOrder(response.order);
        } catch (err) {
            setError("Không thể tải thông tin đơn hàng");
            console.error("Error loading order:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDateOnly = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
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

    const getExportFromLabel = (exportFrom: string) => {
        switch (exportFrom) {
            case "INVENTORY":
                return "Từ kho";
            case "EXTERNAL":
                return "Từ bên ngoài";
            default:
                return exportFrom;
        }
    };

    const getExportFromColor = (exportFrom: string) => {
        switch (exportFrom) {
            case "INVENTORY":
                return "success";
            case "EXTERNAL":
                return "warning";
            default:
                return "default";
        }
    };

    const handleEditStatus = (type: 'delivery' | 'debt') => {
        setEditType(type);
        setEditStatus(type === 'delivery' ? order?.delivery_status || '' : order?.debt_status || '');
        setEditDialogOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!order || !editStatus) return;

        try {
            setUpdating(true);
            setError(null);
            setSuccess(null);
            
            const updateData: UpdateOrderRequest = {
                id: order.id,
            };

            if (editType === 'delivery') {
                updateData.delivery_status = editStatus;
            } else {
                updateData.debt_status = editStatus;
            }

            await ordersApi.update(order.id, updateData);
            
            // Reload order to get updated data
            await loadOrder();
            
            setEditDialogOpen(false);
            setEditStatus('');
            setSuccess("Trạng thái đơn hàng đã được cập nhật thành công");
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccess(null);
            }, 3000);
        } catch (err) {
            setError("Không thể cập nhật trạng thái đơn hàng");
            console.error("Error updating order status:", err);
        } finally {
            setUpdating(false);
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
                <Button onClick={loadOrder} sx={{ mt: 2 }}>
                    Thử lại
                </Button>
            </Box>
        );
    }

    if (!order) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">Không tìm thấy đơn hàng</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.push("/orders")}
                    sx={{ mr: 2 }}
                >
                    Quay lại
                </Button>
                <Typography variant="h4" component="h1">
                    Chi tiết đơn hàng #{order.id}
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Order Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Thông tin đơn hàng
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        ID đơn hàng:
                                    </Typography>
                                    <Typography variant="body1">
                                        {order.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1">
                                        {order.customer_id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Ngày đặt hàng:
                                    </Typography>
                                    <Typography variant="body1">
                                        {formatDateOnly(order.order_date)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Trạng thái giao hàng:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Chip
                                            label={getStatusLabel(order.delivery_status)}
                                            color={getStatusColor(order.delivery_status) as any}
                                            size="small"
                                        />
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditStatus('delivery')}
                                            sx={{ minWidth: 'auto', p: 0.5 }}
                                        >
                                            Sửa
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Trạng thái công nợ:
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="body1" sx={{ flex: 1 }}>
                                            {order.debt_status}
                                        </Typography>
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditStatus('debt')}
                                            sx={{ minWidth: 'auto', p: 0.5 }}
                                        >
                                            Sửa
                                        </Button>
                                    </Box>
                                </Grid>
                                {order.status_transitioned_at && (
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Thời gian chuyển trạng thái:
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDateTime(order.status_transitioned_at)}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Customer Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Thông tin khách hàng
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        ID:
                                    </Typography>
                                    <Typography variant="body1">
                                        {order.customer.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Tên:
                                    </Typography>
                                    <Typography variant="body1">
                                        {order.customer.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Số điện thoại:
                                    </Typography>
                                    <Typography variant="body1">
                                        {order.customer.phone}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Địa chỉ:
                                    </Typography>
                                    <Typography variant="body1">
                                        {order.customer.address}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Tổng quan
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Số lượng sản phẩm:
                                    </Typography>
                                    <Typography variant="h6">
                                        {order.product_count ?? order.order_items.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Tổng tiền:
                                    </Typography>
                                    <Typography variant="h6" color="primary">
                                        {(order.total_amount ?? 0).toLocaleString("vi-VN")} VND
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Sản phẩm trong đơn hàng
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell>Số thùng</TableCell>
                                            <TableCell>Quy cách</TableCell>
                                            <TableCell>Số lượng</TableCell>
                                            <TableCell>Giá bán</TableCell>
                                            <TableCell>Chiết khấu</TableCell>
                                            <TableCell>Thành tiền</TableCell>
                                            <TableCell>Nguồn xuất</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.order_items.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.product_name || item.product_id}</TableCell>
                                                <TableCell>{item.number_of_boxes || "-"}</TableCell>
                                                <TableCell>{item.spec || "-"}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>
                                                    {item.selling_price.toLocaleString("vi-VN")} VND
                                                </TableCell>
                                                <TableCell>{item.discount}%</TableCell>
                                                <TableCell>
                                                    {(item.final_amount ?? 0).toLocaleString("vi-VN")} VND
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={getExportFromLabel(item.export_from)}
                                                        color={getExportFromColor(item.export_from) as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Status Dialog */}
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Cập nhật {editType === 'delivery' ? 'trạng thái giao hàng' : 'trạng thái công nợ'}
                </DialogTitle>
                <DialogContent>
                    {editType === 'delivery' ? (
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Trạng thái giao hàng</InputLabel>
                            <Select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                label="Trạng thái giao hàng"
                            >
                                <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                                <MenuItem value="DELIVERED">Đã giao hàng</MenuItem>
                                <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                                <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            fullWidth
                            sx={{ mt: 2 }}
                            label="Trạng thái công nợ"
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} disabled={updating}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleUpdateStatus} 
                        variant="contained" 
                        disabled={updating || !editStatus}
                    >
                        {updating ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 