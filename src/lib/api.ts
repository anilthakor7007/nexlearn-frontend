import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add tenant ID from localStorage or fallback for development
        const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') : null;
        if (tenantId) {
            config.headers['X-Tenant-ID'] = tenantId;
        } else if (process.env.NODE_ENV === 'development') {
            // Fallback for localhost development (e.g. forgot password flow without login)
            config.headers['X-Tenant-ID'] = '691f0179c7ccdddb9f2f7618';
        }

        // Debug logging
        console.log('API Request:', config.url);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('Tenant ID:', config.headers['X-Tenant-ID']);

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Redirect to login or clear auth state
        }
        return Promise.reject(error);
    }
);

export default api;
