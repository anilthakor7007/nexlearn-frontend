import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                {/* Temporary layout - will be enhanced in Phase 2 */}
                <div className="container mx-auto py-8">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
    );
}
