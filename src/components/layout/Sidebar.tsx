"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    Settings,
    Users,
    GraduationCap,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState } from "react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Courses",
        href: "/dashboard/my-courses",
        icon: BookOpen,
    },
    {
        title: "Browse Courses",
        href: "/dashboard/courses",
        icon: GraduationCap,
    },
    {
        title: "Profile",
        href: "/dashboard/profile",
        icon: Users,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    isMobile?: boolean;
}

export function Sidebar({ className, isMobile }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useAppSelector((state) => state.auth);

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    const items = [
        ...sidebarItems,
        ...(isAdmin ? [{
            title: "Users",
            href: "/dashboard/admin/users",
            icon: Users,
        }] : [])
    ];

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        NexLearn
                    </h2>
                    <div className="space-y-1">
                        {items.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useAppSelector((state) => state.auth);

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    const items = [
        ...sidebarItems,
        ...(isAdmin ? [{
            title: "Users",
            href: "/dashboard/admin/users",
            icon: Users,
        }] : [])
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <SheetHeader>
                    <SheetTitle className="text-left px-4">NexLearn</SheetTitle>
                </SheetHeader>
                <div className="px-3 py-2">
                    <div className="space-y-1 mt-4">
                        {items.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className="w-full justify-start"
                                onClick={() => setOpen(false)}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
