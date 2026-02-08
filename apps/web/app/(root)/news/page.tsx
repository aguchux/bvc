import React from "react";
import Link from "next/link";

export const metadata = {
  title: "News — Bonny Vocational Center",
  description: "Latest news and updates from BVC.",
};

const SAMPLE = [
  {
    id: "n1",
    title: "Admissions Open for 2026",
    date: "2026-02-01",
    href: "#",
  },
  { id: "n2", title: "New ICT Lab Inaugurated", date: "2025-11-12", href: "#" },
];

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">News & Announcements</h1>
      <ul className="mt-6 space-y-4">
        {SAMPLE.map((n) => (
          <li key={n.id} className="rounded-lg border p-4">
            <Link
              href={n.href}
              className="text-lg font-semibold text-slate-800"
            >
              {n.title}
            </Link>
            <div className="mt-1 text-sm text-slate-500">{n.date}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
