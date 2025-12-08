import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.manus.im/v1';

class APIClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // CRITICAL: Enables cross-origin cookie sending
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                // Cookies are sent automatically with withCredentials: true
                return config;
            },
            (error: AxiosError) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - handle errors
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Unauthorized - redirect to login
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }

                // Format error message
                const errorMessage = this.getErrorMessage(error);
                return Promise.reject(new Error(errorMessage));
            }
        );
    }

    private getErrorMessage(error: AxiosError): string {
        if (error.response?.data) {
            const data = error.response.data as any;
            return data.message || data.error || 'An error occurred';
        }
        return error.message || 'Network error';
    }

    // Generic request methods
    async get<T>(url: string, params?: Record<string, any>): Promise<T> {
        const response = await this.client.get<T>(url, { params });
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.put<T>(url, data);
        return response.data;
    }

    async patch<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.patch<T>(url, data);
        return response.data;
    }

    async delete<T>(url: string): Promise<T> {
        const response = await this.client.delete<T>(url);
        return response.data;
    }

    // File upload with multipart/form-data
    async uploadFile<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<T> {
        const formData = new FormData();
        formData.append('file', file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                formData.append(key, String(value));
            });
        }

        const response = await this.client.post<T>(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
}

// Export singleton instance
export const apiClient = new APIClient();

// Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('authToken');
    }
    return false;
};

// Helper function to get current user
export const getCurrentUser = () => {
    if (typeof window !== 'undefined') {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch (error) {
            // Clear corrupted data
            console.error('Failed to parse user data from localStorage:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            return null;
        }
    }
    return null;
};

// Helper function to logout
export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
};
