import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { usersService, CreateUserData, UpdateUserData } from '@/lib/services/usersService';

interface User {
    _id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: 'student' | 'instructor' | 'admin' | 'superadmin';
    tenantId: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    limit: number;
}

interface UsersState {
    users: User[];
    selectedUser: User | null;
    isLoading: boolean;
    error: string | null;
    pagination: Pagination | null;
}

const initialState: UsersState = {
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null,
    pagination: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
        try {
            const response = await usersService.getUsers(page, limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch users'
            );
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'users/fetchUserById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await usersService.getUserById(id);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch user'
            );
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (data: CreateUserData, { rejectWithValue }) => {
        try {
            const response = await usersService.createUser(data);
            const user = response.data.user;
            return { ...user, _id: user.id || user._id };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to create user'
            );
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, data }: { id: string; data: UpdateUserData }, { rejectWithValue }) => {
        try {
            const response = await usersService.updateUser(id, data);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update user'
            );
        }
    }
);

export const changeUserRole = createAsyncThunk(
    'users/changeUserRole',
    async ({ id, role }: { id: string; role: string }, { rejectWithValue }) => {
        try {
            const response = await usersService.changeUserRole(id, role);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to change user role'
            );
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id: string, { rejectWithValue }) => {
        try {
            await usersService.deleteUser(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to delete user'
            );
        }
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedUser: (state, action: PayloadAction<User | null>) => {
            state.selectedUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Fetch Users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch User By ID
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Create User
        builder
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users.unshift(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update User
        builder
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?._id === action.payload._id) {
                    state.selectedUser = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Change User Role
        builder
            .addCase(changeUserRole.pending, (state) => {
                state.isLoading = true;
            })
            // .addCase(changeUserRole.fulfilled, (state, action) => {
            //     console.log("UPDATED USER =", action.payload);
            //     state.isLoading = false;
            //     const index = state.users.findIndex(u => u._id === action.payload._id);
            //     if (index !== -1) {
            //         state.users[index] = action.payload;
            //     }
            // })

            .addCase(changeUserRole.fulfilled, (state, action) => {
                state.isLoading = false;

                // Normalize backend response
                const updatedUser = {
                    ...action.payload,
                    _id: action.payload._id || action.payload.id,  // FIX: Map id → _id
                };

                const index = state.users.findIndex(u => u._id === updatedUser._id);

                if (index !== -1) {
                    // Important: new array reference to trigger UI rerender
                    state.users = state.users.map(user =>
                        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
                    );
                }
            })

            .addCase(changeUserRole.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete User
        builder
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
