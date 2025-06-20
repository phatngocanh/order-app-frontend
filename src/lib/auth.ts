// Simple authentication utilities for login

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
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
  // Store token
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  // Get token
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  // Clear auth
  clearAuth: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
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
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};

export default auth; 