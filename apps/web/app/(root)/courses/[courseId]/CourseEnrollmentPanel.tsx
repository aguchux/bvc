"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";
import { useEnrollInCourseMutation, useGetErollmentStatusQuery } from "store/apis/course.api";

type CourseEnrollmentPanelProps = {
    courseId: number;
};

type Status = "idle" | "loading" | "success" | "error";

export default function CourseEnrollmentPanel({
    courseId,
}: CourseEnrollmentPanelProps) {
    const { isAuthenticated } = useAuth();
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState<string | null>(null);
    const [enrollInCourse, { data, isLoading, error }] = useEnrollInCourseMutation();

    const { data: enrollmentStatus, isLoading: isEnrollmentStatusLoading } = useGetErollmentStatusQuery(courseId, {
        skip: !isAuthenticated,
    });

    const enroll = async () => {
        if (!isAuthenticated || status === "loading") {
            return;
        }
        setMessage(null);
        try {
            const enrollmentInfo = await enrollInCourse(courseId).unwrap();
            const payload = enrollmentInfo?.payload;
            setStatus("success");
            setMessage(payload?.message ?? "Enrollment confirmed.");
        } catch (error) {
            setStatus("error");
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to enroll at this time.",
            );
        }
    };

    const buttonLabel =
        status === "loading"
            ? "Enrolling…"
            : (isAuthenticated && enrollmentStatus?.enrolled)
                ? "You are enrolled ✓"
                : "Enroll now";

    return (
        <div className="space-y-4 rounded-3xl border border-slate-800/40 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    Instant enrollment
                </p>
                <h3 className="text-2xl font-bold my-2">Join this course</h3>
                <p className="mt-2 text-sm text-white/70">
                    Confirm your seat and unlock Moodle content with a single click.
                </p>
            </div>
            <button
                type="button"
                onClick={enroll}
                disabled={!isAuthenticated || status === "loading" || status === "success" || isLoading || isEnrollmentStatusLoading || enrollmentStatus?.enrolled}
                className="w-full rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {buttonLabel}
            </button>

            {!isAuthenticated && (
                <p className="text-xs text-white/70">
                    <Link
                        href={`/auth?redirect=/courses/${courseId}`}
                        className="font-semibold text-white underline"
                    >
                        Sign in
                    </Link>{" "}
                    to enroll in this course.
                </p>
            )}
            {message && (
                <p
                    className={`text-sm ${status === "success" ? "text-emerald-200" : "text-amber-100"
                        }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
}
