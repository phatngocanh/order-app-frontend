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

export interface InventoryInfo {
    quantity: number;
    version: string;
}

export interface ProductResponse {
    id: number;
    name: string;
    spec: number;
    original_price: number;
    inventory?: InventoryInfo;
}

export interface GetAllProductsResponse {
    products: ProductResponse[];
}

export interface GetOneProductResponse {
    product: ProductResponse;
}

// Order types
export interface Order {
    id: number;
    customer_id: number;
    order_date: string;
    delivery_status: string;
    debt_status: string;
    status_transitioned_at?: string;
    additional_cost?: number;
    additional_cost_note?: string;
    order_items: OrderItem[];
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    number_of_boxes?: number;
    spec?: number;
    quantity: number;
    selling_price: number;
    discount: number;
    final_amount?: number;
}

export interface CreateOrderRequest {
    customer_id: number;
    order_date: string;
    delivery_status: string;
    debt_status?: string;
    status_transitioned_at?: string;
    additional_cost?: number;
    additional_cost_note?: string;
    tax_percent?: number;
    order_items: OrderItemRequest[];
}

export interface OrderItemRequest {
    product_id: number;
    number_of_boxes?: number;
    spec?: number;
    quantity: number;
    selling_price: number;
    discount?: number;
    final_amount?: number;
    version: string; // For optimistic locking
    export_from: string; // INVENTORY or EXTERNAL, required
}

export interface UpdateOrderRequest {
    id: number;
    customer_id?: number;
    order_date?: string;
    delivery_status?: string;
    debt_status?: string;
    status_transitioned_at?: string;
    additional_cost?: number;
    additional_cost_note?: string;
    tax_percent?: number;
}

export interface OrderResponse {
    id: number;
    order_date: string;
    delivery_status: string;
    debt_status: string;
    status_transitioned_at?: string;
    additional_cost?: number;
    additional_cost_note?: string;
    order_items: OrderItemResponse[];
    customer: CustomerResponse;
    images?: OrderImage[];
    total_amount?: number;
    product_count?: number;
    tax_percent?: number;
    // Profit/Loss fields for total order
    total_profit_loss?: number;
    total_profit_loss_percentage?: number;
    total_sales_revenue: number
}

export interface OrderItemResponse {
    id: number;
    order_id: number;
    product_id: number;
    product_name?: string;
    number_of_boxes?: number;
    spec?: number;
    quantity: number;
    selling_price: number;
    discount: number;
    final_amount?: number;
    export_from: string;
    // Profit/Loss fields
    original_price?: number;
    profit_loss?: number;
    profit_loss_percentage?: number;
}

export interface GetAllOrdersResponse {
    orders: OrderResponse[];
}

export interface GetOneOrderResponse {
    order: OrderResponse;
}

// Order Image types
export interface OrderImage {
    id: number;
    order_id: number;
    image_url: string;
    image_type?: string;
    s3_key?: string;
}

export interface UploadOrderImageResponse {
    orderImage: OrderImage;
}

export interface GenerateSignedUploadURLResponse {
    signed_url: string;
    s3_key: string;
    image_id: number;
}

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

// Inventory types
export interface InventoryResponse {
    id: number;
    product_id: number;
    quantity: number;
    version: string;
}

export interface ProductInfo {
    id: number;
    name: string;
    spec: number;
    original_price: number;
}

export interface InventoryWithProductResponse {
    id: number;
    product_id: number;
    quantity: number;
    version: string;
    product: ProductInfo;
}

export interface GetAllInventoryResponse {
    inventories: InventoryWithProductResponse[];
}

export interface UpdateInventoryQuantityRequest {
    quantity: number;
    note?: string;
    version: string; // Current version for optimistic locking
}

// Inventory History types
export interface InventoryHistoryResponse {
    id: number;
    product_id: number;
    quantity: number;
    final_quantity: number;
    importer_name: string;
    imported_at: string;
    note?: string;
    reference_id?: number;
}

export interface GetAllInventoryHistoriesResponse {
    inventory_histories: InventoryHistoryResponse[];
}

// Customer types
export interface Customer {
    id: number;
    name: string;
    phone: string;
    address: string;
}

export interface CreateCustomerRequest {
    name: string;
    phone: string;
    address: string;
}

export interface UpdateCustomerRequest {
    name?: string;
    phone?: string;
    address?: string;
}

export interface CustomerResponse {
    id: number;
    name: string;
    phone: string;
    address: string;
}

export interface GetAllCustomersResponse {
    customers: CustomerResponse[];
}

export interface GetOneCustomerResponse {
    customer: CustomerResponse;
}
