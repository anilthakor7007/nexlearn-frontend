'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user && !allowedRoles.includes(user.role)) {
                router.push('/dashboard');
            }
        }
    }, [user, isAuthenticated, isLoading, router, allowedRoles]);

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}
