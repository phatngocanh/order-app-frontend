"use client";

import { useEffect, useState } from "react";

import LoadingButton from "@/components/LoadingButton";
import SkeletonLoader from "@/components/SkeletonLoader";
import { productApi } from "@/lib/products";
import { InventoryResponse, ProductResponse, UpdateProductRequest } from "@/types";
import { Add as AddIcon, Edit as EditIcon, Inventory as InventoryIcon } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [inventories, setInventories] = useState<{ [key: number]: InventoryResponse }>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        spec: number;
        original_price: number;
    }>({
        name: "",
        spec: 0,
        original_price: 0,
    });

    // Load products and their inventories
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load products
            const data = await productApi.getAll();
            setProducts(data);
            
            // Load inventory for each product
            const inventoryData: { [key: number]: InventoryResponse } = {};
            for (const product of data) {
                try {
                    const inventory = await productApi.getInventory(product.id);
                    inventoryData[product.id] = inventory;
                } catch (err) {
                    console.error(`Error loading inventory for product ${product.id}:`, err);
                }
            }
            setInventories(inventoryData);
        } catch (err: any) {
            console.error("Error loading products:", err);
            
            // Extract error message from backend response
            let errorMessage = "Không thể tải danh sách sản phẩm. Vui lòng thử lại.";
            
            if (err.response?.data?.errors && err.response.data.errors.length > 0) {
                errorMessage = err.response.data.errors[0].message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError(null);

            const dataToSubmit = {
                name: formData.name,
                spec: formData.spec,
                original_price: formData.original_price,
            };

            if (editingProduct) {
                // Update existing product
                const updateData: UpdateProductRequest = {
                    id: editingProduct.id,
                    ...dataToSubmit,
                };
                await productApi.update(updateData);
            } else {
                // Create new product
                await productApi.create(dataToSubmit);
            }
            
            // Reset form and reload products
            setOpenDialog(false);
            setEditingProduct(null);
            setFormData({ name: "", spec: 0, original_price: 0 });
            await loadProducts();
        } catch (err: any) {
            console.error("Error saving product:", err);
            
            // Extract error message from backend response
            let errorMessage = "Không thể lưu sản phẩm. Vui lòng thử lại.";
            
            if (err.response?.data?.errors && err.response.data.errors.length > 0) {
                errorMessage = err.response.data.errors[0].message;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle edit
    const handleEdit = (product: ProductResponse) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            spec: product.spec,
            original_price: product.original_price,
        });
        setOpenDialog(true);
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProduct(null);
        setFormData({ name: "", spec: 0, original_price: 0 });
        setError(null);
    };

    // Format price to VND
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Quản lý Sản phẩm
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        disabled
                    >
                        Thêm Sản phẩm
                    </Button>
                </Box>
                <Card>
                    <CardContent>
                        <SkeletonLoader type="table" rows={8} columns={6} />
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Quản lý Sản phẩm
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Thêm Sản phẩm
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Card>
                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Tên sản phẩm</TableCell>
                                    <TableCell>Quy cách</TableCell>
                                    <TableCell>Giá gốc</TableCell>
                                    <TableCell>Số lượng kho</TableCell>
                                    <TableCell>Phiên bản</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => {
                                    const inventory = inventories[product.id];
                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell>{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.spec}</TableCell>
                                            <TableCell>{formatPrice(product.original_price)}</TableCell>
                                            <TableCell>
                                                {inventory ? inventory.quantity : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {inventory ? inventory.version : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Chỉnh sửa Sản phẩm">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Xem lịch sử kho">
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => window.location.href = `/inventory-history?product=${product.id}`}
                                                    >
                                                        <InventoryIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Tên sản phẩm"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            margin="normal"
                            required
                            disabled={submitting}
                        />
                        <TextField
                            fullWidth
                            label="Quy cách"
                            type="text"
                            value={formData.spec !== undefined && formData.spec !== null && !isNaN(formData.spec) ? formData.spec.toLocaleString("vi-VN") : ""}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, spec: raw ? Number(raw) : 0 });
                            }}
                            margin="normal"
                            required
                            disabled={submitting}
                            placeholder="0"
                        />
                        <TextField
                            fullWidth
                            label="Giá gốc (VND)"
                            type="text"
                            value={formData.original_price !== undefined && formData.original_price !== null && !isNaN(formData.original_price) ? formData.original_price.toLocaleString("vi-VN") : ""}
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                setFormData({ ...formData, original_price: raw ? Number(raw) : 0 });
                            }}
                            margin="normal"
                            required
                            disabled={submitting}
                            placeholder="0"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={submitting}>
                        Hủy
                    </Button>
                    <LoadingButton
                        onClick={handleSubmit}
                        variant="contained"
                        loading={submitting}
                        loadingText="Đang lưu..."
                        disabled={!formData.name || formData.spec <= 0 || formData.original_price <= 0}
                    >
                        {editingProduct ? "Cập nhật" : "Thêm"}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 