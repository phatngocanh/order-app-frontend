import { api } from "@/lib/axios";
import {
    ApiResponse,
    GetOrderImagesResponse,
    UploadOrderImageResponse,
} from "@/types";

export const orderImagesApi = {
    // Upload an image for an order
    uploadImage: async (orderId: number, file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post<ApiResponse<UploadOrderImageResponse>>(
            `/orders/${orderId}/images`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data;
    },

    // Get all images for an order
    getImagesByOrderId: async (orderId: number) => {
        const response = await api.get<ApiResponse<GetOrderImagesResponse>>(
            `/orders/${orderId}/images`
        );
        return response.data.data;
    },

    // Delete an image
    deleteImage: async (orderId: number, imageId: number) => {
        const response = await api.delete(`/orders/${orderId}/images/${imageId}`);
        return response.data;
    },
}; 