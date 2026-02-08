"use client";

import Link from "next/link";
import React from "react";
import { dictionary } from "../../lib/lang";
import { useAuth } from "../../contexts/AuthContext";

const TopDasbordLinksSlimBar = () => {
  const { user, loading, isAuthenticated } = useAuth();
  return (
    <div className="bg-[#0f5e78] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
        <div className="opacity-95">{dictionary.en.toplink.topWelcome}</div>
        <div className="hidden gap-6 opacity-95 sm:flex">
          <Link href="#" className="hover:opacity-80">
            Support
          </Link>
          <span className="text-white">|</span>
          {!loading && !isAuthenticated && (
            <Link href="/auth" className="hover:opacity-80 font-bold">
              Log In
            </Link>
          )}
          {!loading && isAuthenticated && (
            <Link href="/dashboard" className="hover:opacity-80">
              {user?.name || "Dashboard"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopDasbordLinksSlimBar;
