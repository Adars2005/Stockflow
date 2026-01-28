"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Package, Settings, LogOut, Building2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

type NavLayoutProps = {
    children: React.ReactNode;
};

export default function NavLayout({ children }: NavLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
                    <p className="mt-4 text-violet-600 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return null;
    }

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Products", href: "/products", icon: Package },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
            <div className="flex">
                {/* Premium Gradient Sidebar */}
                <aside className="w-64 min-h-screen gradient-sidebar shadow-2xl flex flex-col relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10 p-7 border-b border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-7 w-7 text-white" />
                            <h1 className="text-3xl font-bold text-white">StockFlow</h1>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-white/90 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                            <Building2 className="h-4 w-4" />
                            <span className="truncate font-medium">{(session?.user as any)?.organizationName || "Organization"}</span>
                        </div>
                    </div>

                    <nav className="relative z-10 flex-1 p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname?.startsWith(item.href);
                            return (
                                <Link key={item.href} href={item.href}>
                                    <div
                                        className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${isActive
                                                ? "bg-white text-violet-700 shadow-lg shadow-white/20"
                                                : "text-white/90 hover:bg-white/10 hover:translate-x-1"
                                            }`}
                                    >
                                        <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "" : "group-hover:scale-110"}`} />
                                        <span>{item.name}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="relative z-10 p-4 border-t border-white/20">
                        <div className="mb-3 px-4 py-2.5 text-sm text-white/90 bg-white/10 rounded-lg backdrop-blur-sm">
                            <div className="font-medium truncate">{session?.user?.email}</div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-300"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-8 animate-fade-in">{children}</main>
            </div>
        </div>
    );
}
