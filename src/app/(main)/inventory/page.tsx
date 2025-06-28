"use client";

import { useEffect, useState } from "react";

import LoadingButton from "@/components/LoadingButton";
import SkeletonLoader from "@/components/SkeletonLoader";
import { extractErrorMessage } from "@/lib/error-utils";
import { inventoryApi } from "@/lib/inventory";
import { InventoryWithProductResponse, UpdateInventoryQuantityRequest } from "@/types";
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
    const [inventories, setInventories] = useState<InventoryWithProductResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<InventoryWithProductResponse | null>(null);
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

    // Load inventory data (now includes product info)
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Load all inventory with product info in a single API call
            const data = await inventoryApi.getAll();
            setInventories(data.inventories);
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
        if (!selectedInventory) return;
        
        try {
            setSubmitting(true);
            setError(null);

            const dataToSubmit: UpdateInventoryQuantityRequest = {
                quantity: formData.quantity === "" ? 0 : formData.quantity,
                note: formData.note || undefined,
                version: formData.version,
            };

            await inventoryApi.updateQuantity(selectedInventory.product_id, dataToSubmit);
            
            // Reset form and reload data
            setOpenDialog(false);
            setSelectedInventory(null);
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
    const handleEditInventory = (inventory: InventoryWithProductResponse) => {
        setSelectedInventory(inventory);
        setFormData({
            quantity: "",
            note: "",
            version: inventory.version,
        });
        setOpenDialog(true);
    };

    // Handle dialog close
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedInventory(null);
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
                                {inventories.map((inventory) => (
                                    <TableRow key={inventory.product_id}>
                                        <TableCell>{inventory.product_id}</TableCell>
                                        <TableCell>{inventory.product.name}</TableCell>
                                        <TableCell>
                                            {inventory.quantity}
                                        </TableCell>
                                        <TableCell>
                                            {inventory.version}
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Cập nhật số lượng kho">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditInventory(inventory)}
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

            {/* Update Inventory Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Cập nhật số lượng kho - {selectedInventory?.product.name}
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