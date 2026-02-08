import React from "react";

export const metadata = {
  title: "Events — Bonny Vocational Center",
  description: "Upcoming events at BVC.",
};

export default function EventsPage() {
  const events = [
    {
      id: "e1",
      title: "Open Day",
      date: "2026-03-15",
      location: "Bonny Campus",
    },
    {
      id: "e2",
      title: "Skills Workshop: Solar PV",
      date: "2026-04-10",
      location: "Training Hall",
    },
  ];
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Events</h1>
      <div className="mt-6 space-y-4">
        {events.map((ev) => (
          <div key={ev.id} className="rounded-lg border p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{ev.title}</h3>
              <div className="text-sm text-slate-500">{ev.date}</div>
            </div>
            <div className="mt-2 text-sm text-slate-600">{ev.location}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
