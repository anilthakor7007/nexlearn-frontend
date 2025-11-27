'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Redirect to appropriate dashboard based on role
        if (user) {
            if (user.role === 'admin' || user.role === 'tenant_admin' || user.role === 'superadmin') {
                router.push('/dashboard/admin');
            } else if (user.role === 'instructor') {
                router.push('/dashboard/courses');
            } else {
                router.push('/dashboard/my-courses');
            }
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );
}
