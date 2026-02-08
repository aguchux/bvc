"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "../../store/apis/auth.api";
import { useAuth } from "contexts/AuthContext";

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80";

export default function Topbar() {
  const { user, clearUser } = useAuth();
  const displayName = user?.firstname || user?.name || "Student";
  const email = user?.email || "student@bvcbonny.edu.ng";
  const avatar =
    user?.photoUrl ||
    user?.profileImageUrl ||
    user?.profileimageurl ||
    FALLBACK_AVATAR;
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
    <div className="flex items-center justify-between">
      {/* Right actions */}
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-full border border-transparent bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-slate-200 disabled:opacity-50"
        >
          {isLoggingOut ? "Logging out…" : "Logout"}
        </button>

        <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-[var(--border)]">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
            <Image
              src={avatar}
              alt={displayName}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="hidden flex-col text-sm sm:flex">
            <span className="font-semibold text-slate-700">{displayName}</span>
            <span className="text-xs text-slate-500">{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
