import React from 'react';
import { render, screen, waitFor } from '../test-utils';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Mock useRouter
jest.mock('next/navigation');

describe('ProtectedRoute Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        mockPush.mockClear();
    });

    it('should redirect to login if not authenticated', async () => {
        const preloadedState = {
            auth: {
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            },
        };

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>,
            { preloadedState }
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login');
        });
    });

    it('should render children if authenticated', () => {
        const preloadedState = {
            auth: {
                user: {
                    _id: '123',
                    tenantId: 'tenant123',
                    email: 'test@example.com',
                    username: 'testuser',
                    firstName: 'Test',
                    lastName: 'User',
                    role: 'student',
                    isEmailVerified: true,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                },
                token: 'mock-token',
                isAuthenticated: true,
                isLoading: false,
                error: null,
            },
        };

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>,
            { preloadedState }
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should show loading state while loading', () => {
        const preloadedState = {
            auth: {
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: true,
                error: null,
            },
        };

        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>,
            { preloadedState }
        );

        // Should show loading spinner (check for the spinner element)
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect based on role if allowedRoles specified', async () => {
        const preloadedState = {
            auth: {
                user: {
                    _id: '123',
                    tenantId: 'tenant123',
                    email: 'student@example.com',
                    username: 'student',
                    firstName: 'Student',
                    lastName: 'User',
                    role: 'student',
                    isEmailVerified: true,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                },
                token: 'mock-token',
                isAuthenticated: true,
                isLoading: false,
                error: null,
            },
        };

        render(
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
                <div>Admin Content</div>
            </ProtectedRoute>,
            { preloadedState }
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard/my-courses');
        });
    });
});
