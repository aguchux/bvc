"use client";
import React, { useState } from "react";

export const metadata = {
  title: "Contact — Bonny Vocational Center",
  description: "Get in touch with Bonny Vocational Center.",
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(
      `https://wa.me/2349132300000?text=${encodeURIComponent(`${name} (${email}): ${message}`)}`,
      "_blank",
      "noopener",
    );
    setSent(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-3 text-slate-600">
        Questions about admissions, programmes or partnerships.
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <input
          required
          placeholder="Full name"
          className="rounded-md border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          required
          type="email"
          placeholder="Email"
          className="rounded-md border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          required
          rows={6}
          placeholder="Message"
          className="rounded-md border px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            className="rounded bg-[#0f5e78] px-4 py-2 text-white"
            type="submit"
          >
            Send via WhatsApp
          </button>
          <a
            className="rounded border px-4 py-2"
            href="mailto:info@bvcbonny.edu.ng"
          >
            Email us
          </a>
        </div>
        {sent && (
          <div className="text-sm text-green-600">
            WhatsApp opened — complete your message there.
          </div>
        )}
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Visit</h2>
        <p className="mt-2 text-slate-600">
          Bonny Island, Rivers State — contact:{" "}
          <a className="underline" href="tel:+2349132300000">
            +234 913 230 0000
          </a>
        </p>
      </section>
    </main>
  );
}
