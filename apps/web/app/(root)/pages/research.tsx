import React from "react";

export const metadata = {
  title: "Research — Bonny Vocational Center",
  description: "Applied research and industry collaboration at BVC.",
};

export default function ResearchPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Research & Partnerships</h1>
      <p className="mt-3 text-slate-600">
        Applied projects, innovation labs and industry-aligned research.
      </p>
      <div className="mt-6 space-y-6">
        <article>
          <h3 className="text-xl font-semibold">Industry collaboration</h3>
          <p className="mt-2 text-slate-600">
            We partner with local businesses to co-design curricula and
            placement pathways.
          </p>
        </article>
        <article>
          <h3 className="text-xl font-semibold">Innovation labs</h3>
          <p className="mt-2 text-slate-600">
            Small-scale labs where learners prototype solutions for community
            needs.
          </p>
        </article>
      </div>
    </main>
  );
}
