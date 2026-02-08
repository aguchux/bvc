"use client";

import { useMemo, useState } from "react";
import { useAuth } from "contexts/AuthContext";

type Advisor = { id: string; name: string };
type DeferOption = { id: string; label: string };

const advisors: Advisor[] = [
  { id: "a1", name: "Success Advisor - Amina Yusuf" },
  { id: "a2", name: "Success Advisor - Chinedu Okafor" },
  { id: "a3", name: "Success Advisor - Sarah Williams" },
];

const deferOptions: DeferOption[] = [
  { id: "d1", label: "Defer current semester" },
  { id: "d2", label: "Defer current session" },
  { id: "d3", label: "Defer outstanding course(s)" },
  { id: "d4", label: "Defer exams only" },
];

export default function DefermentsPage() {
  const [advisorId, setAdvisorId] = useState("");
  const [deferId, setDeferId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const displayName = user?.firstname ?? user?.name ?? "Student";

  const canSubmit = useMemo(
    () => !!advisorId && !!deferId && !submitting,
    [advisorId, deferId, submitting],
  );

  async function submit() {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 600));
      alert("Deferment request submitted (simulated).");
      setAdvisorId("");
      setDeferId("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mt-5">
        <h1 className="text-xl font-semibold text-slate-900">Deferments</h1>
        <p className="text-sm text-slate-600">
          Plan ahead, {displayName}. Select your advisor and request the
          deferment you need.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
        <div className="bg-[var(--navy)] px-5 py-20 text-center text-white">
          <h1 className="text-xl font-semibold">Deferments</h1>
          <p className="mt-3 text-sm text-white/85">
            Every great journey begins with a single step.
          </p>
        </div>

        <div className="bg-slate-100 px-4 py-10">
          <div className="mx-auto w-full max-w-[760px] rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="space-y-6">
              <SelectField
                label="Who is your Success Advisor?"
                required
                value={advisorId}
                onChange={setAdvisorId}
                placeholder="Select your Success Advisor"
                options={advisors.map((a) => ({ value: a.id, label: a.name }))}
              />

              <SelectField
                label="What would you like to defer?"
                required
                value={deferId}
                onChange={setDeferId}
                placeholder="Select a deferment option"
                options={deferOptions.map((d) => ({
                  value: d.id,
                  label: d.label,
                }))}
              />

              <div className="flex justify-end pt-2">
                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  className={[
                    "rounded-lg px-6 py-2 text-sm font-semibold",
                    canSubmit
                      ? "bg-[var(--navy)] text-white hover:opacity-95"
                      : "cursor-not-allowed bg-slate-200 text-slate-500",
                  ].join(" ")}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>

              <div className="text-xs text-slate-500">* Required fields</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SelectField({
  label,
  required,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <div className="text-sm font-semibold text-slate-800">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-sky-200"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
