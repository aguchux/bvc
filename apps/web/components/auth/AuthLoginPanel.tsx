// app/auth/login/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, LayoutGrid, Moon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useLoginMutation } from "store/apis/auth.api";
import { useAuth, normalizeUserProfile } from "contexts/AuthContext";
import SiteAuthLogo from "../SiteAuthLogo";
import { dictionary } from "lib/lang";
import { useAppDispatch } from "hooks/redux";
import { setMoodleToken } from "store/slices/app.slice";

export default function AuthLoginPage() {
  const dispatch = useAppDispatch();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const redirectTarget = searchParams?.get("redirect") ?? "/dashboard";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const payload = await login({ identifier: email, password }).unwrap();
      const profile = normalizeUserProfile(
        { user: payload.user, moodleToken: payload.moodleToken },
        { openId: email, username: email, email },
      );
      setUser(profile ?? null);
      dispatch(setMoodleToken(profile?.moodleToken ?? null));
      router.push(redirectTarget);
    } catch (err) {
      let message = "Unable to log in";
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
        {/* LEFT: Form */}
        <section className="relative flex items-center justify-center px-6 py-10 lg:px-14">
          <div className="w-full max-w-md">
            {/* logo */}
            <div className="flex flex-col items-center gap-3">
              <Link
                href="/"
                className="self-start text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 transition hover:text-slate-900"
              >
                ← Back to home
              </Link>
              <SiteAuthLogo size={100} />
            </div>

            <h1 className="mt-1 text-center text-3xl font-extrabold text-slate-900">
              Student Log In
            </h1>
            <p className="mt-2 text-center text-sm text-slate-500">
              Enter your account details
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div>
                <label className="sr-only" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email Address"
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                  autoComplete="email"
                  required
                  disabled={isLoggingIn}
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                    autoComplete="current-password"
                    required
                    disabled={isLoggingIn}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-700"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="mt-3 flex justify-end">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {error && (
                <p className="text-sm text-rose-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="mt-2 h-12 w-full rounded-lg bg-[#0f5e78] text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[#0f5e78]/25 disabled:opacity-60"
              >
                {isLoggingIn ? "Signing in…" : "Login"}
              </button>
              <p className="mt-2 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-[#0f5e78]"
                >
                  Create one
                </Link>
                .
              </p>
            </form>
          </div>
        </section>

        {/* RIGHT: Hero image */}
        <section className="relative hidden items-stretch justify-stretch p-6 lg:flex">
          <div className="relative w-full overflow-hidden rounded-3xl">
            {/* background image */}
            <Image
              src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1400&q=80"
              alt="Student learning"
              fill
              className="object-cover"
              priority
            />

            {/* overlay gradient (to match screenshot readability) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

            {/* floating icons on right */}
            <div className="absolute right-6 top-1/2 flex -translate-y-1/2 flex-col gap-3">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/85 text-slate-800 shadow-md backdrop-blur hover:bg-white"
                aria-label="Apps"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/85 text-slate-800 shadow-md backdrop-blur hover:bg-white"
                aria-label="Theme"
              >
                <Moon className="h-4 w-4" />
              </button>
            </div>

            {/* hero text */}
            <div className="absolute left-10 top-1/2 w-[78%] -translate-y-1/2 text-white">
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">
                Learn with
                <br />
                {dictionary.en.config.site_name}
              </h2>
              <p className="mt-4 max-w-xl text-base text-white/85">
                Affordable higher education you can take wherever life takes
                you. Learn anywhere at your own pace.
              </p>

              {/* badge card */}
              <div className="mt-10 w-full max-w-2xl rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600/90">
                    <span className="text-xs font-black tracking-widest text-white">
                      NUC
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white/90">
                    {dictionary.en.config.site_name} is licensed by the National
                    <br className="hidden sm:block" /> Universities Commission
                  </p>
                </div>
              </div>
            </div>

            {/* subtle vignette bottom */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
          </div>
        </section>
      </div>
    </main>
  );
}
