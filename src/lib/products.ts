import { auth } from "@/lib/auth";
import { api } from "@/lib/axios";
import {
    ApiResponse,
    CreateProductRequest,
    GetAllProductsResponse,
    GetOneProductResponse,
    ProductResponse,
    UpdateProductRequest,
} from "@/types";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = auth.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Product API functions
export const productApi = {
    // Create a new product
    create: async (data: CreateProductRequest): Promise<ProductResponse> => {
        const response = await api.post<ApiResponse<ProductResponse>>("/products", data, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    },

    // Update an existing product
    update: async (data: UpdateProductRequest): Promise<ProductResponse> => {
        const response = await api.put<ApiResponse<ProductResponse>>("/products", data, {
            headers: getAuthHeaders(),
        });
        return response.data.data;
    },

    // Get all products
    getAll: async (): Promise<ProductResponse[]> => {
        const response = await api.get<ApiResponse<GetAllProductsResponse>>("/products", {
            headers: getAuthHeaders(),
        });
        return response.data.data.products;
    },

    // Get a single product by ID
    getOne: async (id: number): Promise<ProductResponse> => {
        const response = await api.get<ApiResponse<GetOneProductResponse>>(`/products/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data.data.product;
    },
};

export default productApi; 