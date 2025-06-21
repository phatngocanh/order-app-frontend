import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Create axios instance with default config
// Set NEXT_PUBLIC_API_URL in .env.local file (e.g., http://localhost:3000/api/v1)
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

// API methods
export const api = {
    // POST request for login
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.post<T>(url, data, config),
    
    // PUT request
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.put<T>(url, data, config),
    
    // GET request
    get: <T = any>(url: string, config?: AxiosRequestConfig) =>
        apiClient.get<T>(url, config),
};

export default apiClient;
