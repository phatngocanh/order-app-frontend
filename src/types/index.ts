import React from "react";

// Common TypeScript interfaces for the project

// API Response types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
    error?: string;
}

// Pagination types
export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Product types
export interface Product {
    id: number;
    name: string;
    spec: number;           // Quy cách
    type: string;           // Loại hàng
    original_price: number; // Giá gốc (VND)
}

export interface CreateProductRequest {
    name: string;
    spec: number;
    original_price: number;
}

export interface UpdateProductRequest {
    id: number;
    name: string;
    spec: number;
    original_price: number;
}

export interface ProductResponse {
    id: number;
    name: string;
    spec: number;
    original_price: number;
}

export interface GetAllProductsResponse {
    products: ProductResponse[];
}

export interface GetOneProductResponse {
    product: ProductResponse;
}

// Order types (example for order app)
export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

// Form types
export interface FormField {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "number" | "select" | "textarea";
    required?: boolean;
    options?: { value: string; label: string }[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

// Component props types
export interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}

export interface LoadingProps extends BaseComponentProps {
    loading: boolean;
    error?: string;
}

// Navigation types
export interface NavigationItem {
    label: string;
    path: string;
    icon?: React.ComponentType;
    children?: NavigationItem[];
}

// Error types
export interface AppError {
    code: string;
    message: string;
    details?: any;
}
