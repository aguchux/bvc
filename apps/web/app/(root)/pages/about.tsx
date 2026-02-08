import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About — Bonny Vocational Center",
  description:
    "About Bonny Vocational Center — mission, vision and programmes.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">About Bonny Vocational Center</h1>
      <p className="mt-4 text-slate-700">
        Bonny Vocational Centre (BVC) is a vocational and innovation institution
        established to address technical manpower needs, promote
        entrepreneurship and empower youths from NLNG host communities.
      </p>

      <section id="mission" className="mt-8">
        <h2 className="text-2xl font-semibold">Vision & Mission</h2>
        <p className="mt-3 text-slate-600">
          Our mission is to deliver high-quality practical training through
          industry partnerships and internationally benchmarked standards.
        </p>
      </section>

      <section id="accreditation" className="mt-8">
        <h2 className="text-2xl font-semibold">Accreditation & Recognition</h2>
        <ul className="mt-3 list-disc pl-6 text-slate-600">
          <li>National Board for Technical Education (NBTE)</li>
          <li>City &amp; Guilds of London Institute</li>
          <li>Institute of Leadership &amp; Management (ILM), London</li>
        </ul>
      </section>

      <div className="mt-10 flex gap-3">
        <Link
          href="/programs"
          className="rounded bg-[#0f5e78] px-4 py-2 text-white"
        >
          View Programs
        </Link>
        <Link href="/contact" className="rounded border px-4 py-2">
          Contact Us
        </Link>
      </div>
    </main>
  );
}
