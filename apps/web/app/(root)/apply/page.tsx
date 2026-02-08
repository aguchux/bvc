"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hasActiveSession } from "../../../lib/auth/session";

type AuthState = "checking" | "authenticated" | "redirecting";

const programmes = [
  "School of Computing",
  "School of Management & Social Sciences",
  "School of Communications & Media Studies",
  "School of Allied Health Sciences",
];

export default function ApplyPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    programme: programmes[0],
    goals: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("checking");
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = pathname ?? "/apply";
  const currentRedirect = encodeURIComponent(currentPath);
  const redirectPath = `/auth?redirect=${currentRedirect}`;
  const registerPath = `/auth/register?redirect=${currentRedirect}`;
  const statusMessage =
    authState === "redirecting"
      ? "Redirecting you to the login page before showing the form."
      : "Checking your authentication before showing the application form.";

  const handleChange =
    (field: keyof typeof form) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasActiveSession()) {
      setAuthState("authenticated");
      return;
    }
    setAuthState("redirecting");
    router.replace(redirectPath);
  }, [redirectPath, router]);

  if (authState !== "authenticated") {
    return (
      <main className="min-h-screen bg-[#f7f9fb]">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#0f5e78]">
            Apply
          </p>
          <h1 className="text-4xl font-bold text-slate-900">
            Please log in to continue
          </h1>
          <p className="text-lg text-slate-600">
            You must register or log in before starting an application. Once
            authenticated you will be able to complete the form.
          </p>
          <p className="text-sm text-slate-500">{statusMessage}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={redirectPath}
              className="inline-flex items-center justify-center rounded-xl bg-[#0f5e78] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0a4a63]"
            >
              Log in
            </Link>
            <Link
              href={registerPath}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400"
            >
              Register
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f7f9fb]">
      <div className="mx-auto max-w-5xl space-y-10 px-6 py-12">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#0f5e78]">
            Apply
          </p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Start your Bonny Vocational Center application
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Tell us who you are, what you want to study, and why Bonny
            Vocational Center is the right place for your technical career. Once
            submitted, our admissions team will confirm your eligibility, issue
            approval credentials, and guide you to the next step.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">
                What youâ€™ll need
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>Valid ID or passport</li>
                <li>Updated CV and academic transcripts</li>
                <li>Phone + email for follow-up</li>
                <li>Short personal statement</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Processing</p>
              <p className="mt-2 text-sm text-slate-600">
                We aim to review applications within 3â€“5 business days. Once
                approved, you will receive credentials to log in, review your
                dashboard, and finalize enrolment.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Application form
              </p>
              <h2 className="text-2xl font-bold text-slate-900">
                Letâ€™s get to know you
              </h2>
            </div>
            <span className="text-sm font-semibold text-[#0f5e78]">
              Step 1 of 3
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-600">
                First name
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={handleChange("firstName")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-600">
                Last name
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={handleChange("lastName")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-600">
                Email
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                />
              </label>
              <label className="space-y-1 text-sm text-slate-600">
                Phone number
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                />
              </label>
            </div>
            <label className="space-y-1 text-sm text-slate-600">
              Programme of interest
              <select
                value={form.programme}
                onChange={handleChange("programme")}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
              >
                {programmes.map((programme) => (
                  <option key={programme} value={programme}>
                    {programme}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm text-slate-600">
              Why this programme?
              <textarea
                value={form.goals}
                onChange={handleChange("goals")}
                rows={4}
                placeholder="Share your goals, background, or how this programme will help."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm text-slate-600">
                Upload CV or transcript
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-600"
                />
              </label>
              <div className="rounded-xl border border-dashed border-slate-300 bg-white/80 px-4 py-3 text-sm text-slate-600">
                Once you submit, we will review your documents and contact you
                with approval credentials.
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-[#0f5e78] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0a4a63]"
            >
              {submitted ? "Submitted" : "Submit application"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
