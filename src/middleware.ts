import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route patterns
const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
const authRoutes = ['/login', '/register', '/forgot-password'];
const protectedRoutes = ['/dashboard'];

// Role-based route access
const roleRoutes = {
    admin: ['/dashboard/admin'],
    tenant_admin: ['/dashboard/admin'],
    instructor: ['/dashboard/courses', '/dashboard/admin'],
    student: ['/dashboard/my-courses', '/dashboard/browse', '/dashboard/learn'],
};

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if path is public
    const isPublicRoute = publicRoutes.some(route => path === route);
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

    // Get token from localStorage (will be checked client-side)
    // For server-side, we'll check if the request has authorization header
    const authHeader = request.headers.get('authorization');
    const hasToken = !!authHeader;

    // Allow public routes
    if (isPublicRoute && !isProtectedRoute) {
        return NextResponse.next();
    }

    // Redirect to dashboard if authenticated user tries to access auth pages
    if (isAuthRoute && hasToken) {
        return NextResponse.redirect(new URL('/dashboard/my-courses', request.url));
    }

    // For protected routes, we'll handle authentication client-side
    // since Next.js middleware doesn't have access to localStorage
    // The actual auth check will happen in the layout component

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/login',
        '/register',
        '/dashboard/:path*',
    ],
};
