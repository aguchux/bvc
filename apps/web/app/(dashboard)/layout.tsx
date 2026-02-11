"use client";

import { redirect } from "next/navigation";
import DashboardFooter from "components/home/DashboardFooter";
// import TopDasbordLinksSlimBar from "components/home/TopDasbordLinksSlimBar";
import { useAuth } from "contexts/AuthContext";
import { useEffect } from "react";
import TopLinksSlimBar from "components/home/TopLinksSlimBar";
import { NavigationMenu } from "components/home/NavigationMenu";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, loading } = useAuth();
    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated) {
            redirect("/auth");
        }
    }, [isAuthenticated, loading]);
    return (
        <div className="min-h-full bg-[#f7f6f3]">
            <main className="relative">
                <TopLinksSlimBar />
                <NavigationMenu />
                {children}
                <DashboardFooter />
            </main>
        </div>
    );
}
