import React from "react";

export const metadata = {
  title: "Student Life — Bonny Vocational Center",
  description: "Student support, clubs and campus life at BVC.",
};

export default function StudentLifePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Student Life</h1>
      <p className="mt-3 text-slate-600">
        Clubs, accommodation and student support services to enrich learning.
      </p>
      <ul className="mt-6 list-disc pl-6 text-slate-600">
        <li>Clubs & societies</li>
        <li>Career services & internships</li>
        <li>Accommodation support</li>
      </ul>
    </main>
  );
}
