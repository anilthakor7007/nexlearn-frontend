import api from '../api';
import { AxiosProgressEvent } from 'axios';

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    profile?: {
        bio?: string;
        website?: string;
        linkedin?: string;
        github?: string;
    };
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

export const profileService = {
    /**
     * Update user profile
     */
    async updateProfile(data: UpdateProfileData) {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    /**
     * Upload avatar
     */
    async uploadAvatar(file: File, onUploadProgress?: (progressEvent: AxiosProgressEvent) => void) {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/auth/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
        return response.data;
    },

    /**
     * Change password
     */
    async changePassword(data: ChangePasswordData) {
        const response = await api.put('/auth/change-password', data);
        return response.data;
    },
};
