'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfile } from '@/store/features/profile/profileSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { User } from '@/types/auth.types';

interface ProfileEditFormProps {
    user: User | null;
}

export default function ProfileEditForm({ user }: ProfileEditFormProps) {
    const dispatch = useAppDispatch();
    const { isUpdatingProfile } = useAppSelector((state) => state.profile);

    const [profileForm, setProfileForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        bio: user?.profile?.bio || '',
        website: user?.profile?.website || '',
        linkedin: user?.profile?.linkedin || '',
        github: user?.profile?.github || '',
    });

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(updateProfile({
            firstName: profileForm.firstName,
            lastName: profileForm.lastName,
            profile: {
                bio: profileForm.bio,
                website: profileForm.website,
                linkedin: profileForm.linkedin,
                github: profileForm.github,
            }
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">Email (Read-only)</Label>
                    <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-100"
                    />
                </div>

                <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                        placeholder="Tell us about yourself..."
                        maxLength={500}
                    />
                    <p className="text-sm text-gray-500 mt-1">{profileForm.bio.length}/500 characters</p>
                </div>

                <Separator />

                <h3 className="font-semibold">Social Links</h3>

                <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        placeholder="https://yourwebsite.com"
                    />
                </div>

                <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                        id="linkedin"
                        type="url"
                        value={profileForm.linkedin}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                </div>

                <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                        id="github"
                        type="url"
                        value={profileForm.github}
                        onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                        placeholder="https://github.com/yourusername"
                    />
                </div>

                <Button type="submit" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </form>
        </div>
    );
}
