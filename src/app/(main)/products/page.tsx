"use client";

import { useEffect, useState } from "react";

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
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
    const [formData, setFormData] = useState<{
        name: string;
        spec: number | "";
        original_price: number | "";
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
            setError(null);

            const dataToSubmit = {
                name: formData.name,
                spec: formData.spec === "" ? 0 : formData.spec,
                original_price: formData.original_price === "" ? 0 : formData.original_price,
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
                <Typography>Đang tải sản phẩm...</Typography>
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
                    {editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label="Tên sản phẩm"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Quy cách"
                            type="number"
                            value={formData.spec}
                            onFocus={() => {
                                if (formData.spec === 0) {
                                    setFormData({ ...formData, spec: "" });
                                }
                            }}
                            onBlur={() => {
                                if (formData.spec === "") {
                                    setFormData({ ...formData, spec: 0 });
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setFormData({ ...formData, spec: "" });
                                } else {
                                    const num = parseInt(value, 10);
                                    if (!isNaN(num)) {
                                        setFormData({ ...formData, spec: num });
                                    }
                                }
                            }}
                            fullWidth
                        />
                        <TextField
                            label="Giá gốc (VND)"
                            type="number"
                            value={formData.original_price}
                            onFocus={() => {
                                if (formData.original_price === 0) {
                                    setFormData({ ...formData, original_price: "" });
                                }
                            }}
                            onBlur={() => {
                                if (formData.original_price === "") {
                                    setFormData({ ...formData, original_price: 0 });
                                }
                            }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setFormData({ ...formData, original_price: "" });
                                } else {
                                    const num = parseInt(value, 10);
                                    if (!isNaN(num)) {
                                        setFormData({ ...formData, original_price: num });
                                    }
                                }
                            }}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingProduct ? "Cập nhật" : "Thêm"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 