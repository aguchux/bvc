"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { dictionary } from "../../lib/lang";
import { useLogoutMutation } from "../../store/apis/auth.api";
import { useAuth } from "../../contexts/AuthContext";

const TopLinksSlimBar = () => {
  const { user, loading, isAuthenticated, clearUser } = useAuth();
  const router = useRouter();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.warn("Logout failed", error);
    } finally {
      clearUser();
      router.push("/");
    }
  };
  return (
    <div className="bg-[#0f5e78] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
        <div className="opacity-95">{dictionary.en.toplink.topWelcome}</div>
        <div className="hidden gap-6 opacity-95 sm:flex">
          <Link href="#" className="hover:opacity-80">
            Tuition & Fee
          </Link>
          <Link href="#" className="hover:opacity-80">
            How To Apply
          </Link>
          <Link href="#" className="hover:opacity-80">
            Requirements
          </Link>
          <Link href="#" className="hover:opacity-80">
            Contact
          </Link>
          <span className="text-white">|</span>
          {!loading && !isAuthenticated && (
            <Link href="/auth" className="hover:opacity-80 font-bold">
              Log In
            </Link>
          )}
          {!loading && isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:opacity-80">
                {user?.name || "Dashboard"}
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded px-3 py-1 text-xs font-semibold uppercase cursor-pointer  tracking-[0.1em] text-white transition bg-white/30 hover:bg-white/40 disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out…" : "Logout"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopLinksSlimBar;
