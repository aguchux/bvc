"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAuth } from "contexts/AuthContext";

interface ProfileData extends AuthUserProfile {
  title: string;
  firstName: string;
  lastName: string;
  otherNames: string;
  dob: string;
  gender: "Male" | "Female";
  maritalStatus: string;
  photoUrl?: string;

  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  address: string;

  nextOfKin: string;
  nextOfKinPhone: string;
  nationality: string;
  nationalId: string;

  employmentStatus: string;
  industry: string;
  employer: string;

  studentId: string;
}

const initialProfile: ProfileData = {
  openId: "student-123",
  title: "Mr",
  firstName: "Student",
  lastName: "User",
  otherNames: "",
  dob: "1998-01-01",
  gender: "Male",
  maritalStatus: "MARRIED",

  phone: "+234 80********",
  email: "student@example.com",
  country: "Nigeria",
  state: "",
  city: "",
  address: "New Jerusalem Road, Bonny Island, Rivers State",

  nextOfKin: "John Doe",
  nextOfKinPhone: "+234 80********",
  nationality: "Nigeria",
  nationalId: "***********",

  employmentStatus: "Employed",
  industry: "Education",
  employer: "Bonny Vocational Centre",

  studentId: "301828462",
  photoUrl: undefined,
};

const tabs = ["Basic Details", "Education", "Documents"] as const;
type Tab = (typeof tabs)[number];

export default function StudentProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Basic Details");
  const [editing, setEditing] = useState(false);
  const profileFromUser = useMemo(() => {
    const fullname = user?.name?.trim() || "";
    const firstname =
      user?.firstname?.trim() ||
      fullname.split(" ")[0] ||
      initialProfile.firstName;
    const lastname =
      user?.lastname?.trim() ||
      (fullname.includes(" ")
        ? fullname.split(" ").slice(-1)[0]
        : initialProfile.lastName) ||
      initialProfile.lastName;

    return {
      ...initialProfile,
      firstName: firstname,
      lastName: lastname,
      email: user?.email ?? initialProfile.email,
      phone: initialProfile.phone,
      studentId: user?.openId ?? user?.username ?? initialProfile.studentId,
      photoUrl:
        user?.photoUrl ??
        user?.profileImageUrl ??
        user?.profileimageurl ??
        initialProfile.photoUrl,
    };
  }, [user]);

  const [form, setForm] = useState<ProfileData>(profileFromUser);
  const [storedProfile, setStoredProfile] =
    useState<Partial<ProfileData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const openId = user?.openId ?? user?.username;

  useEffect(() => {
    if (!openId) {
      setStoredProfile(null);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const response = await fetch(
          `/api/auth/profile?openId=${encodeURIComponent(openId)}`,
          {
            signal: controller.signal,
          },
        );
        if (!response.ok) {
          return;
        }
        const data = await response.json().catch(() => ({}) as any);
        if (controller.signal.aborted) {
          return;
        }
        if (data?.profile) {
          setStoredProfile(data.profile);
        }
      } catch (error) {
        console.warn("Failed to load saved profile metadata", error);
      }
    })();
    return () => controller.abort();
  }, [openId]);

  useEffect(() => {
    if (!editing) {
      const merged = {
        ...profileFromUser,
        ...(storedProfile ?? {}),
      } as ProfileData;
      setForm(merged);
    }
  }, [profileFromUser, storedProfile, editing]);

  useEffect(() => {
    if (editing) {
      setSaveMessage(null);
      setSaveError(null);
    }
  }, [editing]);

  const canSave = useMemo(() => editing && !isSaving, [editing, isSaving]);

  function update<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function onSave() {
    if (!canSave) {
      return;
    }
    if (!openId) {
      setSaveError("Unable to identify you. Please refresh the page.");
      return;
    }
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ openId, profile: form }),
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}) as any);
      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to save profile");
      }
      const persisted = (data?.profile as Partial<ProfileData>) ?? form;
      setStoredProfile(persisted);
      setSaveMessage("Profile saved.");
      setEditing(false);
    } catch (error) {
      let message = "Unable to save profile.";
      if (error && typeof error === "object") {
        const err = error as { message?: string };
        if (err.message) {
          message = err.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  const displayName = user?.firstname ?? user?.name ?? "Student";

  return (
    <>
      <div className="mt-5">
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">
          Keep your information up to date, {displayName}.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <section className="lg:col-span-4">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-start gap-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-[var(--border)]">
                {form.photoUrl ? (
                  <Image
                    src={form.photoUrl}
                    alt={`${form.firstName} ${form.lastName}`}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm uppercase tracking-wide text-slate-500">
                    Photo
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">
                  {form.firstName} {form.lastName}
                </div>
                <div className="mt-2 space-y-2 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">
                    {form.studentId}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                    <span className="truncate">{form.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                    <span>{form.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={[
                    "w-full rounded-lg px-4 py-3 text-left text-sm font-semibold",
                    activeTab === t
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="lg:col-span-8">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900">
                {activeTab === "Basic Details"
                  ? "Personal Information"
                  : activeTab}
              </div>

              <button
                onClick={() => setEditing((v) => !v)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {editing ? "Stop Editing" : "Edit"}
              </button>
            </div>

            {activeTab === "Basic Details" ? (
              <div className="mt-5 space-y-8">
                <Section title="Personal Information">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <SelectField
                      label="Title"
                      value={form.title}
                      onChange={(v) => update("title", v)}
                      disabled={!editing}
                      options={["Mr", "Mrs", "Ms", "Dr"]}
                    />
                    <InputField
                      label="First Name"
                      value={form.firstName}
                      onChange={(v) => update("firstName", v)}
                      disabled={!editing}
                    />
                    <InputField
                      label="Last Name"
                      value={form.lastName}
                      onChange={(v) => update("lastName", v)}
                      disabled={!editing}
                    />
                    <InputField
                      label="Other Names"
                      value={form.otherNames}
                      onChange={(v) => update("otherNames", v)}
                      disabled={!editing}
                    />

                    <InputField
                      label="Date of Birth"
                      type="date"
                      value={form.dob}
                      onChange={(v) => update("dob", v)}
                      disabled={!editing}
                    />

                    <GenderField
                      value={form.gender}
                      onChange={(v) => update("gender", v)}
                      disabled={!editing}
                    />

                    <SelectField
                      label="Marital Status"
                      value={form.maritalStatus}
                      onChange={(v) => update("maritalStatus", v)}
                      disabled={!editing}
                      options={["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]}
                    />
                  </div>
                </Section>

                <Section title="Contact Information">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InputField
                      label="Phone Number"
                      value={form.phone}
                      onChange={(v) => update("phone", v)}
                      disabled={!editing}
                    />
                    <InputField
                      label="Email Address"
                      value={form.email}
                      onChange={(v) => update("email", v)}
                      disabled={!editing}
                    />

                    <SelectField
                      label="Country"
                      value={form.country}
                      onChange={(v) => update("country", v)}
                      disabled={!editing}
                      options={["Nigeria", "Ghana", "Kenya", "United Kingdom"]}
                    />
                    <SelectField
                      label="State"
                      value={form.state}
                      onChange={(v) => update("state", v)}
                      disabled={!editing}
                      options={["", "Rivers", "Lagos", "Abuja (FCT)"]}
                      placeholder="Select option"
                    />
                    <SelectField
                      label="City"
                      value={form.city}
                      onChange={(v) => update("city", v)}
                      disabled={!editing}
                      options={["", "Bonny", "Port Harcourt", "Lagos"]}
                      placeholder="Select option"
                    />

                    <div className="md:col-span-2">
                      <InputField
                        label="Residential Address"
                        value={form.address}
                        onChange={(v) => update("address", v)}
                        disabled={!editing}
                      />
                    </div>

                    <InputField
                      label="Next of Kin"
                      value={form.nextOfKin}
                      onChange={(v) => update("nextOfKin", v)}
                      disabled={!editing}
                    />
                    <InputField
                      label="Next of Kin's Phone Number"
                      value={form.nextOfKinPhone}
                      onChange={(v) => update("nextOfKinPhone", v)}
                      disabled={!editing}
                    />

                    <SelectField
                      label="Nationality"
                      value={form.nationality}
                      onChange={(v) => update("nationality", v)}
                      disabled={!editing}
                      options={["Nigeria", "Ghana", "Kenya", "United Kingdom"]}
                    />
                    <InputField
                      label="National Id"
                      value={form.nationalId}
                      onChange={(v) => update("nationalId", v)}
                      disabled={!editing}
                    />
                  </div>
                </Section>

                <div className="flex justify-end">
                  <button
                    onClick={onSave}
                    disabled={!canSave}
                    className={[
                      "rounded-lg px-6 py-2 text-sm font-semibold",
                      canSave
                        ? "bg-[var(--navy)] text-white hover:opacity-95"
                        : "cursor-not-allowed bg-slate-100 text-slate-400",
                    ].join(" ")}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                {activeTab} content placeholder — build forms here to match your
                portal.
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------------- small UI helpers ---------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-800 outline-none",
          "focus:ring-2 focus:ring-sky-200",
          disabled ? "bg-slate-50 text-slate-500" : "",
        ].join(" ")}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  disabled,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  options: string[];
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-2 w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-800 outline-none",
          "focus:ring-2 focus:ring-sky-200",
          disabled ? "bg-slate-50 text-slate-500" : "",
        ].join(" ")}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || placeholder || "Select"}
          </option>
        ))}
      </select>
    </label>
  );
}

function GenderField({
  value,
  onChange,
  disabled,
}: {
  value: "Male" | "Female";
  onChange: (v: "Male" | "Female") => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-700">Gender</div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {(["Male", "Female"] as const).map((g) => {
          const active = value === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => !disabled && onChange(g)}
              className={[
                "flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold",
                active
                  ? "border-slate-400 bg-slate-100 text-slate-800"
                  : "border-[var(--border)] bg-white text-slate-600 hover:bg-slate-50",
                disabled ? "cursor-not-allowed opacity-70" : "",
              ].join(" ")}
            >
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}
