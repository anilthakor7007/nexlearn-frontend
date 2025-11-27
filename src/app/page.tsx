'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'tenant_admin' || user.role === 'superadmin') {
        router.push('/dashboard/admin');
      } else if (user.role === 'instructor') {
        router.push('/dashboard/courses');
      } else {
        router.push('/dashboard/my-courses');
      }
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex flex-col items-center justify-center gap-8 text-center px-4">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Welcome to <span className="text-indigo-600">NexLearn</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Enterprise-grade multi-tenant Learning Management System with AI capabilities
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-md">
          <h3 className="font-semibold text-gray-900 mb-2">✅ Phase 1 Complete</h3>
          <p className="text-sm text-gray-600">
            Authentication system is fully functional. Try logging in or creating an account!
          </p>
        </div>
      </main>
    </div>
  );
}
