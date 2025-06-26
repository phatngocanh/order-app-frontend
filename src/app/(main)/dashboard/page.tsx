"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import LoadingSpinner from "@/components/LoadingSpinner";
import { customerApi } from "@/lib/customers";
import { ordersApi } from "@/lib/orders";
import { productApi } from "@/lib/products";
import { 
    Favorite as FavoriteIcon,
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

// Motivational messages for your girlfriend
const motivationalMessages = [
    "Em là người mạnh mẽ nhất mà anh từng biết. Mọi thử thách đều chỉ là bước đệm để em tỏa sáng hơn nữa! 💪✨",
    "Hôm nay là một ngày mới, và em xứng đáng có được mọi điều tốt đẹp nhất. Hãy tin vào bản thân mình! 🌟",
    "Stress chỉ là tạm thời, nhưng sự kiên cường của em là vĩnh cửu. Em sẽ vượt qua tất cả! 🚀",
    "Mỗi ngày em đều cho thấy mình là một người phi thường. Anh rất tự hào về em! 👑",
    "Em có khả năng biến mọi khó khăn thành cơ hội. Đó chính là sức mạnh đặc biệt của em! 💎",
    "Hãy nhớ rằng em không đơn độc. Anh luôn ở đây để ủng hộ và yêu thương em! ❤️",
    "Em là người tạo ra sự khác biệt trong cuộc sống của mọi người. Đừng bao giờ quên điều đó! 🌈",
    "Mỗi bước đi của em đều đang xây dựng một tương lai tươi sáng. Hãy tiếp tục tiến về phía trước! 🎯",
    "Em có trái tim ấm áp và tâm hồn mạnh mẽ. Đó là sự kết hợp hoàn hảo để chinh phục mọi thử thách! 💖",
    "Hôm nay em có thể cảm thấy mệt mỏi, nhưng ngày mai em sẽ mạnh mẽ hơn bao giờ hết! 🌅",
    "Em là nguồn cảm hứng cho rất nhiều người. Hãy luôn giữ ngọn lửa đó trong tim! 🔥",
    "Mọi thứ em làm đều có ý nghĩa và giá trị. Em đang tạo ra những điều tuyệt vời! 🎨",
    "Em có quyền được hạnh phúc, được nghỉ ngơi, và được yêu thương. Đừng quên chăm sóc bản thân! 🌸",
    "Stress không thể định nghĩa em. Em là người mạnh mẽ, thông minh và đầy tài năng! ⭐",
    "Mỗi ngày em đều học được điều mới và trưởng thành hơn. Em đang phát triển rất tốt! 🌱",
    "Em có khả năng biến ước mơ thành hiện thực. Hãy tin vào sức mạnh của mình! 🚀",
    "Em là người đặc biệt và duy nhất. Không ai có thể thay thế được em trong trái tim anh! 💝",
    "Mọi khó khăn đều sẽ qua đi, nhưng tình yêu và sự ủng hộ của anh dành cho em sẽ mãi mãi! 💕",
    "Em xứng đáng được yêu thương, được tôn trọng và được hạnh phúc. Hãy nhớ điều đó! 🏆",
    "Em là người phụ nữ tuyệt vời nhất mà anh từng gặp. Anh rất may mắn khi có em trong cuộc đời! 👸",
    "Mỗi nụ cười của em đều làm thế giới này đẹp hơn. Hãy luôn giữ nụ cười đó! 😊",
    "Em có sức mạnh nội tâm phi thường. Em có thể vượt qua mọi thử thách! 🌟",
    "Em là người phụ nữ thông minh, xinh đẹp và tài năng. Em xứng đáng với mọi điều tốt đẹp! 👸",
    "Mỗi thử thách em gặp phải đều làm em mạnh mẽ hơn. Em đang trưởng thành từng ngày! 🌱",
    "Em có trái tim nhân hậu và tâm hồn trong sáng. Đó là những phẩm chất quý giá nhất! 💎",
    "Anh tin tưởng vào em hoàn toàn. Em có thể làm được mọi thứ em muốn! 🎯",
    "Em là người phụ nữ độc lập và mạnh mẽ. Em không cần ai phải cứu, em tự cứu chính mình! 🦋",
    "Mỗi ngày em đều cho thấy mình là một người phi thường. Em đang làm rất tốt! ⭐",
    "Em có quyền được nghỉ ngơi, được thư giãn và được yêu thương. Đừng quên điều đó! 🌸",
    "Stress chỉ là một giai đoạn tạm thời. Em sẽ vượt qua và trở nên mạnh mẽ hơn! 🚀",
    "Em là người phụ nữ tuyệt vời với trái tim ấm áp. Em xứng đáng được hạnh phúc! 💖",
    "Mỗi bước đi của em đều có ý nghĩa. Em đang tạo ra một cuộc sống tuyệt vời! 🎨",
    "Em có khả năng biến mọi ước mơ thành hiện thực. Hãy tin vào chính mình! 🌈",
    "Em là người phụ nữ mạnh mẽ, thông minh và xinh đẹp. Em có thể làm được mọi thứ! 👸",
    "Anh rất tự hào về em. Em đang làm rất tốt trong mọi việc! 🏆",
    "Em có sức mạnh nội tâm phi thường. Không có gì có thể ngăn cản em! 💪",
    "Em là người phụ nữ đặc biệt và duy nhất. Em xứng đáng với tất cả những điều tốt đẹp! 💝",
    "Mỗi ngày em đều cho thấy mình là một người phi thường. Em đang phát triển rất tốt! 🌟",
    "Em có trái tim nhân hậu và tâm hồn trong sáng. Em là người phụ nữ tuyệt vời! 💎",
    "Anh luôn ở đây để ủng hộ và yêu thương em. Em không bao giờ đơn độc! ❤️",
    "Em có khả năng biến mọi khó khăn thành cơ hội. Em là người phụ nữ mạnh mẽ! 🚀",
    "Em xứng đáng được yêu thương, được tôn trọng và được hạnh phúc. Hãy nhớ điều đó! 👑",
    "Em là người phụ nữ tuyệt vời nhất mà anh từng gặp. Anh rất may mắn khi có em! 💕"
];

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
    const [motivationalMessage, setMotivationalMessage] = useState("");

    useEffect(() => {
        // Set random motivational message
        const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
        setMotivationalMessage(motivationalMessages[randomIndex]);

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

            {/* Motivational Message Card */}
            <Card 
                sx={{ 
                    mb: 4, 
                    background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        opacity: 0.3,
                    }
                }}
            >
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FavoriteIcon sx={{ fontSize: 32, mr: 2, color: 'white' }} />
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            Tin nhắn động viên cho em 💝
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ 
                        fontSize: '1.1rem', 
                        lineHeight: 1.6,
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        fontStyle: 'italic'
                    }}>
                        {motivationalMessage}
                    </Typography>
                </CardContent>
            </Card>

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