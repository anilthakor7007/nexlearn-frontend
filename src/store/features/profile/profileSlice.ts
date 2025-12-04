// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { profileService, UpdateProfileData, ChangePasswordData } from '@/lib/services/profileService';
// import { RootState } from '@/store';

// interface ProfileState {
//     isLoading: boolean;
//     error: string | null;
//     uploadProgress: number;
//     successMessage: string | null;
// }

// const initialState: ProfileState = {
//     isLoading: false,
//     error: null,
//     uploadProgress: 0,
//     successMessage: null,
// };

// // Async thunks
// export const updateProfile = createAsyncThunk(
//     'profile/updateProfile',
//     async (data: UpdateProfileData, { rejectWithValue }) => {
//         try {
//             const response = await profileService.updateProfile(data);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message || 'Failed to update profile'
//             );
//         }
//     }
// );

// export const uploadAvatar = createAsyncThunk(
//     'profile/uploadAvatar',
//     async (file: File, { rejectWithValue, dispatch }) => {
//         try {
//             const response = await profileService.uploadAvatar(file, (progressEvent) => {
//                 const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//                 dispatch(setUploadProgress(progress));
//             });
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message || 'Failed to upload avatar'
//             );
//         }
//     }
// );

// export const changePassword = createAsyncThunk(
//     'profile/changePassword',
//     async (data: ChangePasswordData, { rejectWithValue }) => {
//         try {
//             const response = await profileService.changePassword(data);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(
//                 error.response?.data?.message || 'Failed to change password'
//             );
//         }
//     }
// );

// const profileSlice = createSlice({
//     name: 'profile',
//     initialState,
//     reducers: {
//         clearError: (state) => {
//             state.error = null;
//         },
//         clearSuccessMessage: (state) => {
//             state.successMessage = null;
//         },
//         setUploadProgress: (state, action) => {
//             state.uploadProgress = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         // Update Profile
//         builder
//             .addCase(updateProfile.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//                 state.successMessage = null;
//             })
//             .addCase(updateProfile.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.successMessage = 'Profile updated successfully';

//                 // Update auth state with new user data
//                 const updatedUser = action.payload.user;
//                 if (typeof window !== 'undefined' && updatedUser) {
//                     const currentUser = localStorage.getItem('user');
//                     if (currentUser) {
//                         const user = JSON.parse(currentUser);
//                         const merged = { ...user, ...updatedUser };
//                         localStorage.setItem('user', JSON.stringify(merged));
//                     }
//                 }
//             })
//             .addCase(updateProfile.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload as string;
//             });

//         // Upload Avatar
//         builder
//             .addCase(uploadAvatar.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//                 state.uploadProgress = 0;
//                 state.successMessage = null;
//             })
//             .addCase(uploadAvatar.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.uploadProgress = 100;
//                 state.successMessage = 'Avatar uploaded successfully';

//                 // Update auth state with new avatar
//                 const avatarData = action.payload.user;
//                 if (typeof window !== 'undefined' && avatarData?.avatar) {
//                     const currentUser = localStorage.getItem('user');
//                     if (currentUser) {
//                         const user = JSON.parse(currentUser);
//                         user.avatar = avatarData.avatar;
//                         localStorage.setItem('user', JSON.stringify(user));

//                         // Dispatch event to notify auth slice
//                         window.dispatchEvent(new Event('storage'));
//                     }
//                 }
//             })
//             .addCase(uploadAvatar.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.uploadProgress = 0;
//                 state.error = action.payload as string;
//             });

//         // Change Password
//         builder
//             .addCase(changePassword.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//                 state.successMessage = null;
//             })
//             .addCase(changePassword.fulfilled, (state) => {
//                 state.isLoading = false;
//                 state.successMessage = 'Password changed successfully';
//             })
//             .addCase(changePassword.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload as string;
//             });
//     },
// });

// export const { clearError, clearSuccessMessage, setUploadProgress } = profileSlice.actions;
// export const selectProfile = (state: RootState) => state.profile;
// export default profileSlice.reducer;



import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService, UpdateProfileData, ChangePasswordData } from '@/lib/services/profileService';
import { RootState } from '@/store';
import { AxiosError } from 'axios';
import { ApiError } from '@/types/auth.types';

interface ProfileState {
    isUpdatingProfile: boolean;
    isUploadingAvatar: boolean;
    isChangingPassword: boolean;

    error: string | null;
    uploadProgress: number;
    successMessage: string | null;
}

const initialState: ProfileState = {
    isUpdatingProfile: false,
    isUploadingAvatar: false,
    isChangingPassword: false,

    error: null,
    uploadProgress: 0,
    successMessage: null,
};

// Async thunks
export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (data: UpdateProfileData, { rejectWithValue }) => {
        try {
            const response = await profileService.updateProfile(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                (error as AxiosError<ApiError>).response?.data?.message || 'Failed to update profile'
            );
        }
    }
);

export const uploadAvatar = createAsyncThunk(
    'profile/uploadAvatar',
    async (file: File, { rejectWithValue, dispatch }) => {
        try {
            const response = await profileService.uploadAvatar(file, (progressEvent) => {
                const total = progressEvent.total || 100; // Default to 100 to avoid division by zero
                const progress = Math.round((progressEvent.loaded * 100) / total);
                dispatch(setUploadProgress(progress));
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                (error as AxiosError<ApiError>).response?.data?.message || 'Failed to upload avatar'
            );
        }
    }
);

export const changePassword = createAsyncThunk(
    'profile/changePassword',
    async (data: ChangePasswordData, { rejectWithValue }) => {
        try {
            const response = await profileService.changePassword(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                (error as AxiosError<ApiError>).response?.data?.message || 'Failed to change password'
            );
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
    },
    extraReducers: (builder) => {

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isUpdatingProfile = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdatingProfile = false;
                state.successMessage = 'Profile updated successfully';

                const updatedUser = action.payload.user;
                if (typeof window !== 'undefined' && updatedUser) {
                    const currentUser = localStorage.getItem('user');
                    if (currentUser) {
                        const user = JSON.parse(currentUser);
                        const merged = { ...user, ...updatedUser };
                        localStorage.setItem('user', JSON.stringify(merged));
                    }
                }
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdatingProfile = false;
                state.error = action.payload as string;
            });

        // Upload Avatar
        builder
            .addCase(uploadAvatar.pending, (state) => {
                state.isUploadingAvatar = true;
                state.error = null;
                state.uploadProgress = 0;
                state.successMessage = null;
            })
            .addCase(uploadAvatar.fulfilled, (state, action) => {
                state.isUploadingAvatar = false;
                state.uploadProgress = 100;
                state.successMessage = 'Avatar uploaded successfully';

                const avatarData = action.payload.user;
                if (typeof window !== 'undefined' && avatarData?.avatar) {
                    const currentUser = localStorage.getItem('user');
                    if (currentUser) {
                        const user = JSON.parse(currentUser);
                        user.avatar = avatarData.avatar;
                        localStorage.setItem('user', JSON.stringify(user));
                        window.dispatchEvent(new Event('storage'));
                    }
                }
            })
            .addCase(uploadAvatar.rejected, (state, action) => {
                state.isUploadingAvatar = false;
                state.uploadProgress = 0;
                state.error = action.payload as string;
            });

        // Change Password
        builder
            .addCase(changePassword.pending, (state) => {
                state.isChangingPassword = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.isChangingPassword = false;
                state.successMessage = 'Password changed successfully';
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.isChangingPassword = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearSuccessMessage, setUploadProgress } = profileSlice.actions;
export const selectProfile = (state: RootState) => state.profile;
export default profileSlice.reducer;
