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
        // Auth token
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Tenant ID - only add if available (not required for password reset)
        if (typeof window !== 'undefined') {
            let tenantId = localStorage.getItem('tenantId');

            if (!tenantId) {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    try {
                        const user = JSON.parse(userStr);
                        tenantId = user.tenantId;
                    } catch (e) {
                        console.error('Error parsing user from localStorage', e);
                    }
                }
            }

            // Only add header if we have a valid tenant ID
            if (tenantId) {
                config.headers['X-Tenant-ID'] = tenantId;
            }
        }

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
