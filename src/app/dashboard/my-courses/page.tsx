'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyCoursesPage() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.firstName} {user?.lastName}!
                    </p>
                </div>
                <Button onClick={handleLogout} variant="outline">
                    Logout
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>🎉 Authentication Complete!</CardTitle>
                    <CardDescription>
                        Phase 1 of the frontend development is working. You are now logged in.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Username:</span>
                            <span>{user?.username}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Role:</span>
                            <span className="capitalize">{user?.role}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Tenant ID:</span>
                            <span className="text-xs">{user?.tenantId}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            <strong>Next Steps:</strong> Phase 2 will add the full dashboard layout with navigation,
                            sidebar, and user menu. Course functionality will be added in Phase 4-6.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
