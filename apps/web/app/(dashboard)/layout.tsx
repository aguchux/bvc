"use client";

import { redirect } from "next/navigation";
import DashboardFooter from "components/home/DashboardFooter";
import TopDasbordLinksSlimBar from "components/home/TopDasbordLinksSlimBar";
import { useAuth } from "contexts/AuthContext";
import { useEffect } from "react";

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
        <TopDasbordLinksSlimBar />
        {children}
        <DashboardFooter />
      </main>
    </div>
  );
}
