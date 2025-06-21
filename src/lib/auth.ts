// Simple authentication utilities for login

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    username: string;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    errors?: Array<{
        code: string;
        field: string;
        message: string;
    }>;
}

// Simple auth utilities
export const auth = {
    // Store token and username
    setToken: (token: string, username: string): void => {
        if (typeof window !== "undefined") {
            localStorage.setItem("authToken", token);
            localStorage.setItem("username", username);
        }
    },

    // Get token
    getToken: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("authToken");
        }
        return null;
    },

    // Get username
    getUsername: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("username");
        }
        return null;
    },

    // Clear auth
    clearAuth: (): void => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("authToken");
            localStorage.removeItem("username");
        }
    },

    // Check if authenticated
    isAuthenticated: (): boolean => {
        const token = auth.getToken();
        return !!token;
    },

    // Logout
    logout: (): void => {
        auth.clearAuth();
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    },
};

export default auth;
