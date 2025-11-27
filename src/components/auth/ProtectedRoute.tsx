'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

/**
 * Client-side route protection component
 * Checks authentication status and redirects if needed
 */
export default function ProtectedRoute({
    children,
    allowedRoles
}: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        // Don't redirect while loading
        if (isLoading) return;

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Check role-based access if roles are specified
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            // Redirect to appropriate dashboard based on role
            if (user.role === 'admin' || user.role === 'tenant_admin') {
                router.push('/dashboard/admin');
            } else if (user.role === 'instructor') {
                router.push('/dashboard/courses');
            } else {
                router.push('/dashboard/my-courses');
            }
        }
    }, [isAuthenticated, user, isLoading, allowedRoles, router]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Don't render if role check fails
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
}
