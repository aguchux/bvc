"use client";

import Link from "next/link";
import React from "react";

/* New: compact SVG icons for the utility (kept inline to avoid new imports) */
export function UtilIcon({ name }: { name: string }) {
  switch (name) {
    case "community":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M17 20v-2a3 3 0 0 0-3-3H6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="7" r="2" stroke="currentColor" strokeWidth="1.4" />
          <circle
            cx="17"
            cy="8"
            r="2"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "store":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 7h18l-1 11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2L3 7z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3v4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 3v4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "library":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 19V5h6v14M20 19V5h-6v14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "classroom":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="3"
            y="6"
            width="18"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M8 10h8M8 14h5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "profile":
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle
            cx="12"
            cy="8"
            r="3"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M5.5 20a6.5 6.5 0 0 1 13 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

const UtilityMenu = () => {
  const utility = [
    { key: "community", label: "Community", href: "#" },
    { key: "store", label: "Store", href: "#" },
    { key: "library", label: "E‑Library", href: "/dashboard/library" },
    { key: "classroom", label: "Classroom", href: "/dashboard/classroom" },
    { key: "profile", label: "Profile", href: "/dashboard/profile" },
  ];

  return (
    <nav
      className="ml-3 flex flex-row justify-between gap-2 w-auto"
      aria-label="Utility"
      id="utility-menu"
    >
      {utility.map((u) => (
        <Link
          href={u.href}
          key={u.key}
          className="group flex w-full items-center cursor-pointer gap-3 rounded-sm px-2 py-1 text-sm text-white/90 hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-400 hover:outline-none hover:ring-1 hover:ring-gray-400"
          aria-label={u.label}
          title={u.label}
        >
          <>
            <span
              className="utility-icon flex h-10 w-10 items-center justify-center rounded-sm bg-[#147a99] hover:bg-[#147a99] focus:bg-[#147a99] text-white shadow-sm"
              aria-hidden
            >
              <UtilIcon name={u.key} />
            </span>
            <span className="hidden md:inline-block">{u.label}</span>
          </>
        </Link>
      ))}
    </nav>
  );
};

export default UtilityMenu;
