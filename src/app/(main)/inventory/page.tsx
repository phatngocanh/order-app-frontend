"use client";

import { useEffect, useState } from "react";

import LoadingButton from "@/components/LoadingButton";
import SkeletonLoader from "@/components/SkeletonLoader";
import { extractErrorMessage } from "@/lib/error-utils";
import { productApi } from "@/lib/products";
import { InventoryResponse, ProductResponse, UpdateInventoryQuantityRequest } from "@/types";
import { Edit as EditIcon } from "@mui/icons-material";
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

export default function InventoryPage() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [inventories, setInventories] = useState<{ [key: number]: InventoryResponse }>({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [formData, setFormData] = useState<{
        quantity: number | "";
        note: string;
        version: string;
    }>({
        quantity: "",
        note: "",
        version: "",
    });

    // Focus quantity input when dialog opens
    useEffect(() => {
        if (openDialog) {
            const timer = setTimeout(() => {
                const quantityInput = document.querySelector('input[type="number"]') as HTMLInputElement;
                if (quantityInput) {
                    quantityInput.focus();
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [openDialog]);

    // Load products and their inventories
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load products
            const productsData = await productApi.getAll();
            setProducts(productsData);
            
            // Load inventory for each product
            const inventoryData: { [key: number]: InventoryResponse } = {};
            for (const product of productsData) {
                try {
                    const inventory = await productApi.getInventory(product.id);
                    inventoryData[product.id] = inventory;
                } catch (err) {
                    console.error(`Error loading inventory for product ${product.id}:`, err);
                }
            }
            setInventories(inventoryData);
        } catch (err: any) {
            console.error("Error loading data:", err);
            setError(extractErrorMessage(err, "Không thể tải dữ liệu kho. Vui lòng thử lại."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handle form submission
    const handleSubmit = async () => {
        if (!selectedProduct) return;
        
        try {
            setSubmitting(true);
            setError(null);

            const dataToSubmit: UpdateInventoryQuantityRequest = {
                quantity: formData.quantity === "" ? 0 : formData.quantity,
                note: formData.note || undefined,
                version: formData.version,
            };

            await productApi.updateInventoryQuantity(selectedProduct.id, dataToSubmit);
            
            // Reset form and reload data
            setOpenDialog(false);
            setSelectedProduct(null);
            setFormData({ quantity: "", note: "", version: "" });
            await loadData();
        } catch (err: any) {
            console.error("Error updating inventory:", err);
            setError(extractErrorMessage(err, "Không thể cập nhật số lượng kho. Vui lòng thử lại."));
        } finally {
            setSubmitting(false);
        }
    };

    // Handle edit inventory
    const handleEditInventory = (product: ProductResponse) => {
        setSelectedProduct(product);
        const currentInventory = inventories[product.id];
        setFormData({
            quantity: "",
            note: "",
            version: currentInventory ? currentInventory.version : "",
        });
        setOpenDialog(true);
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedProduct(null);
        setFormData({ quantity: "", note: "", version: "" });
        setError(null);
    };

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Quản lý Kho
                    </Typography>
                </Box>
                <Card>
                    <CardContent>
                        <SkeletonLoader type="table" rows={8} columns={5} />
                    </CardContent>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Quản lý Kho
                </Typography>
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
                                    <TableCell>Số lượng hiện tại</TableCell>
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
                                            <TableCell>
                                                {inventory ? inventory.quantity : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                {inventory ? inventory.version : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <Tooltip title="Cập nhật số lượng kho">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleEditInventory(product)}
                                                    >
                                                        <EditIcon />
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

            {/* Update Inventory Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Cập nhật số lượng kho - {selectedProduct?.name}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="Số lượng thay đổi"
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value === "" ? "" : Number(e.target.value) })}
                            margin="normal"
                            required
                            disabled={submitting}
                            helperText="Nhập số dương để tăng, số âm để giảm"
                        />
                        <TextField
                            fullWidth
                            label="Ghi chú"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            margin="normal"
                            multiline
                            rows={3}
                            disabled={submitting}
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
                        loadingText="Đang cập nhật..."
                        disabled={formData.quantity === ""}
                    >
                        Cập nhật
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Box>
    );
} 