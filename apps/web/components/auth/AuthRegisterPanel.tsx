// app/auth/register/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { dictionary } from "../../lib/lang";
import { useAuth, normalizeUserProfile } from "../../contexts/AuthContext";
import { useRegisterMutation } from "../../store/apis/auth.api";

export default function AuthRegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
  });
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const redirectTarget = searchParams?.get("redirect") ?? "/dashboard";

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const payload = await register({
        username: form.username,
        email: form.email,
        password: form.password,
        firstname: form.firstname,
        lastname: form.lastname,
      }).unwrap();

      const profile = normalizeUserProfile(
        { user: payload.user, moodleToken: payload.moodleToken },
        {
          openId: form.username,
          username: form.username,
          email: form.email,
          name: `${form.firstname} ${form.lastname}`.trim() || form.username,
        },
      );
      setUser(profile ?? null);
      router.push(redirectTarget);
    } catch (err) {
      let message = "Unable to register";
      if (err && typeof err === "object") {
        const queryError = err as { data?: any; message?: string };
        if (queryError.data?.error) {
          message = String(queryError.data.error);
        } else if (typeof queryError.message === "string") {
          message = queryError.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-2">
        <section className="relative flex items-center justify-center px-6 py-10 lg:px-14">
          <div className="w-full max-w-md space-y-6">
            <Link
              href="/"
              className="self-start text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 transition hover:text-slate-900"
            >
              ← Back to home
            </Link>
            <div className="text-center mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#0f5e78]">
                Register
              </p>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900">
                Create your student account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Use the same credentials to access both the portal and Moodle.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-600">
                  First name
                  <input
                    type="text"
                    value={form.firstname}
                    onChange={handleChange("firstname")}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  Last name
                  <input
                    type="text"
                    value={form.lastname}
                    onChange={handleChange("lastname")}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                  />
                </label>
              </div>
              <label className="block text-sm text-slate-600">
                Username
                <input
                  type="text"
                  value={form.username}
                  onChange={handleChange("username")}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                />
              </label>
              <label className="block text-sm text-slate-600">
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-600">
                  Password
                  <input
                    type="password"
                    value={form.password}
                    onChange={handleChange("password")}
                    required
                    minLength={8}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                  />
                </label>
                <label className="block text-sm text-slate-600">
                  Confirm password
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    required
                    minLength={8}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#0f5e78] focus:outline-none focus:ring-2 focus:ring-[#0f5e78]/30"
                  />
                </label>
              </div>
              {error && (
                <p className="text-sm text-rose-600" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full rounded-xl bg-[#0f5e78] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a4a63] disabled:opacity-60"
              >
                {isRegistering ? "Creating account…" : "Create account"}
              </button>
              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/auth" className="text-[#0f5e78] font-semibold">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </section>
        <section className="relative hidden items-stretch justify-stretch p-6 lg:flex">
          <div className="relative w-full overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=80"
              alt="Students learning"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="absolute left-8 top-1/2 w-3/4 -translate-y-1/2 text-white">
              <p className="text-sm uppercase tracking-[0.4em]">
                {dictionary.en.config.site_name}
              </p>
              <h2 className="mt-4 text-4xl font-extrabold">
                Start your journey with a recognized Skill Center.
              </h2>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
