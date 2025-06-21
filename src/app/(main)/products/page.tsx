"use client";

import { useEffect,useState } from "react";

import { productApi } from "@/lib/products";
import { CreateProductRequest, ProductResponse, UpdateProductRequest } from "@/types";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
    const [formData, setFormData] = useState<CreateProductRequest>({
        name: "",
        spec: 0,
        type: "",
        original_price: 0,
    });

    // Load products
    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await productApi.getAll();
            setProducts(data);
        } catch (err) {
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
            console.error("Error loading products:", err);
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
            if (editingProduct) {
                // Update existing product
                const updateData: UpdateProductRequest = {
                    id: editingProduct.id,
                    ...formData,
                };
                await productApi.update(updateData);
            } else {
                // Create new product
                await productApi.create(formData);
            }
            
            // Reset form and reload products
            setOpenDialog(false);
            setEditingProduct(null);
            setFormData({ name: "", spec: 0, type: "", original_price: 0 });
            await loadProducts();
        } catch (err) {
            setError("Không thể lưu sản phẩm. Vui lòng thử lại.");
            console.error("Error saving product:", err);
        }
    };

    // Handle edit
    const handleEdit = (product: ProductResponse) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            spec: product.spec,
            type: product.type,
            original_price: product.original_price,
        });
        setOpenDialog(true);
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingProduct(null);
        setFormData({ name: "", spec: 0, type: "", original_price: 0 });
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
                                    <TableCell>Loại hàng</TableCell>
                                    <TableCell>Giá gốc</TableCell>
                                    <TableCell>Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.spec}</TableCell>
                                        <TableCell>{product.type}</TableCell>
                                        <TableCell>{formatPrice(product.original_price)}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Chỉnh sửa Sản phẩm">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                            onChange={(e) => setFormData({ ...formData, spec: parseInt(e.target.value) || 0 })}
                            fullWidth
                        />
                        <TextField
                            label="Loại hàng"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Giá gốc (VND)"
                            type="number"
                            value={formData.original_price}
                            onChange={(e) => setFormData({ ...formData, original_price: parseInt(e.target.value) || 0 })}
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