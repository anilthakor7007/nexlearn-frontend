'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { uploadAvatar, changePassword, clearError, clearSuccessMessage } from '@/store/features/profile/profileSlice';
import { updateUserAvatar } from '@/store/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, Eye, EyeOff } from 'lucide-react';
import ProfileEditForm from './ProfileEditForm';

export default function ProfilePage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const {
        isUploadingAvatar,
        isChangingPassword,
        error,
        successMessage,
        uploadProgress
    } = useAppSelector((state) => state.profile);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile form state moved to ProfileEditForm

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Avatar preview
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (successMessage || error) {
            const timer = setTimeout(() => {
                dispatch(clearSuccessMessage());
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage, error, dispatch]);



    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2MB');
                return;
            }

            // Validate file type
            if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                alert('Only JPEG, PNG, and WebP images are allowed');
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload
            const result = await dispatch(uploadAvatar(file));

            // Update auth state with new avatar
            if (uploadAvatar.fulfilled.match(result)) {
                const avatarUrl = result.payload?.user?.avatar;
                if (avatarUrl) {
                    dispatch(updateUserAvatar(avatarUrl));
                }
                setAvatarPreview(null);
            }
        }
    };

    // Password visibility state
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            alert('New password must be at least 6 characters');
            return;
        }

        const result = await dispatch(changePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
        }));

        // Clear form only on success
        if (changePassword.fulfilled.match(result)) {
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    };

    const getInitials = () => {
        if (!user) return 'U';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview;
        if (user?.avatar) {
            // If avatar starts with /uploads, prepend backend URL
            if (user.avatar.startsWith('/uploads')) {
                // Remove /api from NEXT_PUBLIC_API_URL to get base backend URL
                const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
                return `${backendUrl}${user.avatar}`;
            }
            return user.avatar;
        }
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold">Profile Settings</h1>
                <p className="text-gray-500">Manage your account settings and preferences</p>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Avatar Section */}
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={getAvatarUrl() || undefined} />
                            <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
                        </Avatar>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90"
                            disabled={isUploadingAvatar}
                        >
                            <Camera className="h-4 w-4" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-600">
                            Click the camera icon to upload a new avatar. Max size: 2MB.
                        </p>
                        <p className="text-sm text-gray-600">
                            Supported formats: JPEG, PNG, WebP
                        </p>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{uploadProgress}% uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Information */}
            <ProfileEditForm user={user} key={user?._id || 'loading'} />

            {/* Password Change */}
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                required
                                minLength={6}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" disabled={isChangingPassword}>
                        {isChangingPassword ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Changing...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
