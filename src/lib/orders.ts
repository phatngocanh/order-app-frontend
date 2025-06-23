import { api } from "@/lib/axios";
import {
    ApiResponse,
    CreateOrderRequest,
    GetAllOrdersResponse,
    GetOneOrderResponse,
    UpdateOrderRequest,
} from "@/types";

export const ordersApi = {
    // Create a new order
    create: async (data: CreateOrderRequest) => {
        const response = await api.post("/orders", data);
        return response.data;
    },

    // Update an existing order
    update: async (orderId: number, data: UpdateOrderRequest) => {
        const response = await api.put(`/orders/${orderId}`, data);
        return response.data;
    },

    // Get all orders
    getAll: async () => {
        const response = await api.get<ApiResponse<GetAllOrdersResponse>>("/orders");
        return response.data.data;
    },

    // Get order by ID
    getOne: async (orderId: number) => {
        const response = await api.get<ApiResponse<GetOneOrderResponse>>(`/orders/${orderId}`);
        return response.data.data;
    },

    // Delete order by ID
    delete: async (orderId: number) => {
        const response = await api.delete(`/orders/${orderId}`);
        return response.data;
    },
}; 