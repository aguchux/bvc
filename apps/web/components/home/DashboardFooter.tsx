import Link from "next/link";
import React from "react";
import { dictionary } from "../../lib/lang";

const social = [
  { label: "Facebook", icon: "F" },
  { label: "Twitter", icon: "T" },
  { label: "Instagram", icon: "I" },
  { label: "LinkedIn", icon: "in" },
  { label: "TikTok", icon: "t" },
  { label: "YouTube", icon: "▶" },
];

const DashboardFooter = () => {
  return (
    <footer className="bg-[#0F5E78] text-white">
      <div className="border-t border-white/10 bg-[#0a4a5b] px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()}. {dictionary.en.config.site_name}. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/80">
            <Link href="#" className="transition hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {social.map((item) => (
              <Link
                key={item.label}
                href="#"
                aria-label={item.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs transition hover:border-white hover:text-white"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DashboardFooter;
