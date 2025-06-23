import { api } from "@/lib/axios";
import {
    ApiResponse,
    CreateProductRequest,
    GetAllInventoryHistoriesResponse,
    GetAllProductsResponse,
    GetOneProductResponse,
    InventoryHistoryResponse,
    InventoryResponse,
    ProductResponse,
    UpdateInventoryQuantityRequest,
    UpdateProductRequest,
} from "@/types";

// Product API functions
export const productApi = {
    // Create a new product
    create: async (data: CreateProductRequest): Promise<ProductResponse> => {
        const response = await api.post<ApiResponse<ProductResponse>>("/products", data);
        return response.data.data;
    },

    // Update an existing product
    update: async (data: UpdateProductRequest): Promise<ProductResponse> => {
        const response = await api.put<ApiResponse<ProductResponse>>("/products", data);
        return response.data.data;
    },

    // Get all products
    getAll: async (): Promise<ProductResponse[]> => {
        const response = await api.get<ApiResponse<GetAllProductsResponse>>("/products");
        return response.data.data.products;
    },

    // Get a single product by ID
    getOne: async (id: number): Promise<ProductResponse> => {
        const response = await api.get<ApiResponse<GetOneProductResponse>>(`/products/${id}`);
        return response.data.data.product;
    },

    // Get inventory by product ID
    getInventory: async (productId: number): Promise<InventoryResponse> => {
        const response = await api.get<ApiResponse<InventoryResponse>>(`/products/${productId}/inventories`);
        return response.data.data;
    },

    // Update inventory quantity
    updateInventoryQuantity: async (productId: number, data: UpdateInventoryQuantityRequest): Promise<InventoryResponse> => {
        const response = await api.put<ApiResponse<InventoryResponse>>(`/products/${productId}/inventories/quantity`, data);
        return response.data.data;
    },

    // Get inventory history for a product
    getInventoryHistory: async (productId: number): Promise<InventoryHistoryResponse[]> => {
        const response = await api.get<ApiResponse<GetAllInventoryHistoriesResponse>>(`/products/${productId}/inventories/histories`);
        return response.data.data.inventory_histories;
    },
};

export default productApi; 