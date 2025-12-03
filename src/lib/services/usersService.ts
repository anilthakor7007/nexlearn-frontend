import api from '../api';

export interface CreateUserData {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'student' | 'instructor' | 'admin';
}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    profile?: {
        bio?: string;
        website?: string;
        linkedin?: string;
        github?: string;
    };
}

export const usersService = {
    /**
     * Get all users with pagination
     */
    async getUsers(page: number = 1, limit: number = 10) {
        const response = await api.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    /**
     * Get user by ID
     */
    async getUserById(id: string) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    /**
     * Create new user
     */
    async createUser(data: CreateUserData) {
        const response = await api.post('/users', data);
        return response.data;
    },

    /**
     * Update user
     */
    async updateUser(id: string, data: UpdateUserData) {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    /**
     * Change user role
     */
    async changeUserRole(id: string, role: string) {
        const response = await api.put(`/users/${id}/role`, { role });
        return response.data;
    },

    /**
     * Delete user
     */
    async deleteUser(id: string) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};
