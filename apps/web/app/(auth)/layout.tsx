'use client';

import { useAuth } from "contexts/AuthContext";
import { redirect } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    useEffect(() => {
        if (loading) return;
        if (isAuthenticated) {
            redirect("/dashboard");
        }
    }, [isAuthenticated, loading]);
    return <>{children}</>;
}
