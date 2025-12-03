import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/lib/services/authService';
import type {
    User,
    LoginCredentials,
    RegisterData,
    ProfileUpdateData,
    ChangePasswordData,
    ResetPasswordData,
} from '@/types/auth.types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Initialize state from localStorage
const getInitialState = (): AuthState => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        return {
            user,
            token,
            isAuthenticated: !!token,
            isLoading: false,
            error: null,
        };
    }

    return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    };
};

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);

            // Backend returns {success, message, data: {token, user}}
            // authService.login returns response.data (the axios response data)
            // So response is {success, message, data: {token, user}}
            const { token, user } = response.data;

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return { token, user };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed. Please try again.'
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);

            // Backend returns {success, message, data: {token, user}}
            const { token, user } = response.data;

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }

            return { token, user };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Registration failed. Please try again.'
            );
        }
    }
);

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getProfile();

            // Update localStorage
            if (typeof window !== 'undefined' && response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch profile.'
            );
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: ProfileUpdateData, { rejectWithValue }) => {
        try {
            const response = await authService.updateProfile(data);

            // Update localStorage
            if (typeof window !== 'undefined' && response.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update profile.'
            );
        }
    }
);

export const changeUserPassword = createAsyncThunk(
    'auth/changePassword',
    async (data: ChangePasswordData, { rejectWithValue }) => {
        try {
            await authService.changePassword(data);
            return { success: true };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to change password.'
            );
        }
    }
);

export const forgotUserPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await authService.forgotPassword(email);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to send reset email.'
            );
        }
    }
);

export const resetUserPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data: ResetPasswordData, { rejectWithValue }) => {
        try {
            const response = await authService.resetPassword(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to reset password.'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;

            // Persist to localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            }
        },
        updateUserAvatar: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.avatar = action.payload;
                // Update localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;

            // Clear localStorage
            authService.logout();
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Profile
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload as User;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Profile
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload as User;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Change Password
        builder
            .addCase(changeUserPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changeUserPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(changeUserPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Forgot Password
        builder
            .addCase(forgotUserPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotUserPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(forgotUserPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Reset Password
        builder
            .addCase(resetUserPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetUserPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(resetUserPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setCredentials, updateUserAvatar, logout, clearError } = authSlice.actions;
export default authSlice.reducer;

