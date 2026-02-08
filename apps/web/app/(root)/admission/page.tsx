import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Admission — Bonny Vocational Center",
  description: "Application process, requirements and key dates.",
};

export default function AdmissionPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Admission</h1>
      <p className="mt-3 text-slate-600">How to apply and important dates.</p>
      <ol className="mt-4 list-decimal pl-6 text-slate-600">
        <li>Check programme requirements</li>
        <li>Complete online application</li>
        <li>Submit documents & attend screening</li>
      </ol>
      <div className="mt-6">
        <Link
          href="/apply"
          className="rounded bg-[#0f5e78] px-4 py-2 text-white"
        >
          Start Application
        </Link>
      </div>
    </main>
  );
}
