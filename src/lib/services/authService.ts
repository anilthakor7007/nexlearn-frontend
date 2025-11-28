import api from '../api';
import type {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    ProfileUpdateData,
    ChangePasswordData,
    ResetPasswordData,
    ApiResponse,
    User,
} from '@/types/auth.types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Register new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<ApiResponse<User>> {
        const response = await api.get<ApiResponse<User>>('/auth/profile');
        return response.data;
    },

    /**
     * Update user profile
     */
    async updateProfile(data: ProfileUpdateData): Promise<ApiResponse<User>> {
        const response = await api.put<ApiResponse<User>>('/auth/profile', data);
        return response.data;
    },

    /**
     * Change password
     */
    async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
        const response = await api.put<ApiResponse>('/auth/change-password', data);
        return response.data;
    },

    /**
     * Forgot password request
     */
    async forgotPassword(email: string): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>('/auth/forgot-password', { email });
        return response.data;
    },

    /**
     * Reset password with token
     */
    async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
        const response = await api.post<ApiResponse>('/auth/reset-password', data);
        return response.data;
    },

    /**
     * Logout user (client-side cleanup)
     */
    logout(): void {
        // Remove token from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
};
