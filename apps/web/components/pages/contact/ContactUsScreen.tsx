"use client";
import React, { useState } from "react";

export default function ContactUsScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder — integrate with backend or email provider
    window.open(
      `https://wa.me/2349132300000?text=${encodeURIComponent(
        `Contact request from ${name} (${email}): ${message}`,
      )}`,
      "_blank",
      "noopener",
    );
    setSent(true);
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Contact Us</h1>
      <p className="mt-3 text-slate-600">
        Questions about programs, admissions or partnerships — we're here to
        help.
      </p>

      <form onSubmit={send} className="mt-8 grid gap-4">
        <input
          className="rounded-md border px-3 py-2"
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-md border px-3 py-2"
          required
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          className="rounded-md border px-3 py-2"
          required
          rows={6}
          placeholder="Message"
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
            href="mailto:info@bonnyvc.edu"
          >
            Email us
          </a>
        </div>
        {sent && (
          <div className="text-sm text-green-600">
            Opened WhatsApp — complete your message there.
          </div>
        )}
      </form>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Visit / Phone</h2>
        <p className="mt-2 text-slate-600">
          Phone:{" "}
          <a className="underline" href="https://wa.me/2349132300000">
            +234 913 230 0000 (WhatsApp)
          </a>
        </p>
        <p className="mt-2 text-slate-600">Address: Bonny, Rivers State</p>
      </section>
    </main>
  );
}
