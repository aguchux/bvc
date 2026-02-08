import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Programs — Bonny Vocational Center",
  description: "Programme categories and courses at BVC.",
};

const CATEGORIES = [
  { id: "engineering", title: "Engineering & Industrial Trades" },
  { id: "construction", title: "Construction & Built Environment" },
  { id: "electrical", title: "Electrical & Mechanical Systems" },
  { id: "ict", title: "ICT & Digital Skills" },
  { id: "business", title: "Business, Leadership & Entrepreneurship" },
  { id: "hospitality", title: "Hospitality & Services" },
];

export default function ProgramsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Programmes</h1>
      <p className="mt-3 text-slate-600">
        BVC delivers practical, industry-aligned programmes across technical and
        professional areas.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div key={c.id} className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Explore {c.title} courses and certifications.
            </p>
            <div className="mt-4">
              <Link
                href={`/programs#${c.id}`}
                className="text-sm font-semibold text-[#0f5e78]"
              >
                View courses →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
