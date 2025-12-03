"use client";

import Header from "./Header";
import { Sidebar } from "./Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-gray-100/40 md:flex">
                <Sidebar className="flex-1" />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
