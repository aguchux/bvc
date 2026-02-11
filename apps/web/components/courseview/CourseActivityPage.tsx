"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import type { CourseDetail } from "store/apis/course.api";

type NamedModule = MoodleCourseContentModule & { id: number; name: string };

function CourseTopNav() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--navy)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3 text-white">
          <div className="h-9 w-9 rounded-lg bg-white/10" />
          <div className="text-sm font-bold tracking-wide text-white">
            Bonny Vocational Center
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-white/70">
          Learning dashboard
        </div>
      </div>
    </header>
  );
}

type SectionModule = {
  id: string;
  title: string;
  description: string;
  section: string;
  modname: string;
  visible: boolean;
  url?: string;
};

type SectionGroup = {
  section: string;
  items: SectionModule[];
};

type MoodleCourseContentModule = {
  id?: number;
  name?: string;
  description?: string;
  modname?: string;
  visible?: number;
  contents?: Array<{ fileurl?: string }>;
  url?: string;
  modurl?: string;
};

type MoodleCourseContentSection = {
  name?: string;
  section?: number;
  modules?: MoodleCourseContentModule[];
};

const FALLBACK_DESCRIPTION = "Module description is not available yet.";

const stripHtml = (value?: string) => {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, "").trim();
};

export default function CourseActivityPage() {
  const params = useParams();
  const router = useRouter();
  const courseIdParam = params?.courseId;
  const activityIdParam = params?.activityId;
  const courseId = courseIdParam ? Number(courseIdParam) : NaN;
  const pathname = usePathname();

  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitedModules, setVisitedModules] = useState<Set<string>>(
    () => new Set(),
  );

  const addVisitedModule = useCallback((id: string) => {
    setVisitedModules((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!courseId || Number.isNaN(courseId)) {
      setError("Invalid course selected.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/courses/${courseId}`, {
      cache: "no-store",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Unable to load course (${res.status})`);
        }
        return (await res.json()) as CourseDetail;
      })
      .then((data) => {
        if (!cancelled) {
          setCourseDetail(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Unable to load course.";
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const isNamedModule = (
    m: MoodleCourseContentModule | null | undefined,
  ): m is NamedModule =>
    Boolean(m?.id) && typeof m?.name === "string" && m.name.trim().length > 0;

  const sections = useMemo<SectionGroup[]>(() => {
    const rawContents = courseDetail?.contents;
    const contents = Array.isArray(rawContents)
      ? (rawContents as MoodleCourseContentSection[])
      : [];

    return contents
      .map((section, index) => {
        const sectionName =
          section.name?.trim() ||
          `Section ${section.section ?? index + 1}` ||
          "Untitled section";

        const modules =
          Array.isArray(section.modules) && section.modules.length > 0
            ? (section.modules as MoodleCourseContentModule[])
                .filter(isNamedModule)
                .map((module) => {
                  const fileUrl =
                    module?.contents?.[0]?.fileurl ??
                    module?.url ??
                    module?.modurl ??
                    null;

                  return {
                    id: String(module.id),
                    title: module.name, // now guaranteed string
                    description:
                      stripHtml(module.description) || FALLBACK_DESCRIPTION,
                    section: sectionName,
                    modname: module.modname ?? "module",
                    visible: module.visible !== 0,
                    url: fileUrl ?? undefined,
                  };
                })
            : [];

        return { section: sectionName, items: modules };
      })
      .filter((section) => section.items.length > 0);
  }, [courseDetail?.contents]);
  const modules = useMemo(
    () => sections.flatMap((section) => section.items),
    [sections],
  );

  const moduleCount = modules.length;
  const completionPercent = moduleCount
    ? Math.round((visitedModules.size / moduleCount) * 100)
    : 0;

  useEffect(() => {
    if (!modules.length) return;
    if (
      activityIdParam &&
      modules.some((module) => module.id === activityIdParam)
    ) {
      setActiveId(activityIdParam as string);
      return;
    }
    if (!activeId) {
      setActiveId(modules[0]?.id ?? null);
    } else if (!modules.some((module) => module.id === activeId)) {
      setActiveId(modules[0]?.id ?? null);
    }
  }, [modules, activityIdParam, activeId]);

  useEffect(() => {
    if (activeId) {
      addVisitedModule(activeId);
    }
  }, [activeId, addVisitedModule]);

  const handleModuleSelect = (id: string) => {
    if (!id) return;
    const activityBase =
      pathname?.split("/activity")[0] ??
      `/learn/classroom/course/${courseIdParam ?? ""}`;
    const url = `${activityBase}/activity/${id}`;
    setActiveId(id);
    addVisitedModule(id);
    router.replace(url);
    setMenuOpen(false);
  };

  const activeModule =
    modules.find((module) => module.id === activeId) ?? modules[0];

  const course = courseDetail?.course;
  const summary = stripHtml(course?.summary);

  const handleStudy = () => {
    if (!activeModule) return;
    addVisitedModule(activeModule.id);
    if (activeModule.url) {
      window.open(activeModule.url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CourseTopNav />
        <div className="mx-auto max-w-[1400px] px-4 py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center text-sm text-slate-500">
            Loading your course...
          </div>
        </div>
      </div>
    );
  }

  if (error || !courseIdParam) {
    return (
      <div className="min-h-screen bg-white">
        <CourseTopNav />
        <div className="mx-auto max-w-[1400px] px-4 py-12">
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
            {error ?? "Unable to load course data."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CourseTopNav />

      <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
        <div className="space-y-6">
          <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Course overview
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {course?.fullname ?? "Untitled course"}
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  {summary || "This course is being prepared by instructors."}
                </p>
              </div>
              <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
                {moduleCount} module{moduleCount === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-[#0F5E78]"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-500">
              <span>{completionPercent}% completed</span>
              <span>
                {visitedModules.size} / {moduleCount} module
                {moduleCount === 1 ? "" : "s"} visited
              </span>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                      Current activity
                    </p>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {activeModule?.title ?? "Select an activity"}
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    {activeModule?.modname ?? "Module"}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {activeModule?.description ?? FALLBACK_DESCRIPTION}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleStudy}
                    disabled={!activeModule}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#0F5E78] px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {activeModule?.url ? "Open module" : "Mark as studied"}
                  </button>
                  <button
                    onClick={() => setMenuOpen(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-700 transition hover:bg-slate-50"
                  >
                    Jump to another activity
                  </button>
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    Activity list
                  </p>
                  <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
                    {sections.length} section{sections.length === 1 ? "" : "s"}
                  </span>
                </div>
                <ModuleSectionList
                  sections={sections}
                  activeId={activeModule?.id ?? null}
                  onSelect={handleModuleSelect}
                  visited={visitedModules}
                />
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Course menu
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Pick any module to see its details and track your progress.
                </p>
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => setMenuOpen(true)}
                    className="w-full rounded-2xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Open course menu
                  </button>
                </div>
              </section>

              <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">
                  Quick stats
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Sections</span>
                    <span>{sections.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Activities</span>
                    <span>{moduleCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Visited</span>
                    <span>{visitedModules.size}</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <CourseMenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sections={sections}
        activeId={activeModule?.id ?? null}
        onSelect={handleModuleSelect}
      />
    </div>
  );
}

function ModuleSectionList({
  sections,
  activeId,
  onSelect,
  visited,
}: {
  sections: SectionGroup[];
  activeId: string | null;
  onSelect: (id: string) => void;
  visited: Set<string>;
}) {
  if (!sections.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        Modules are being prepared. Please check back soon.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.section}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
        >
          <div className="text-sm font-semibold text-slate-900">
            {section.section}
          </div>
          <div className="mt-3 space-y-2">
            {section.items.map((module) => {
              const isActive = module.id === activeId;
              const isVisited = visited.has(module.id);
              return (
                <button
                  key={module.id}
                  onClick={() => onSelect(module.id)}
                  className={[
                    "w-full rounded-2xl border px-4 py-3 text-left transition",
                    isActive
                      ? "border-[var(--border)] bg-white font-semibold text-slate-900"
                      : "border-transparent bg-white/60 text-slate-600 hover:border-slate-200 hover:bg-white",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span>{module.title}</span>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-slate-500">
                      {module.modname}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {module.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-500">
                    <span>{module.visible ? "Visible" : "Hidden"}</span>
                    <span>{isVisited ? "Visited" : "Pending"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CourseMenuDrawer({
  open,
  onClose,
  sections,
  activeId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  sections: SectionGroup[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[360px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <div className="text-sm font-semibold text-slate-900">
            Course menu
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>
        <div className="h-[calc(100%-56px)] overflow-auto p-4">
          <div className="space-y-4">
            {sections.map((section) => (
              <details
                key={section.section}
                open
                className="rounded-xl border border-[var(--border)] bg-slate-50"
              >
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-800">
                  {section.section}
                </summary>
                <div className="space-y-1 px-2 pb-2">
                  {section.items.map((module) => (
                    <button
                      key={module.id}
                      onClick={() => onSelect(module.id)}
                      className={[
                        "w-full rounded-lg px-3 py-2 text-left text-sm",
                        module.id === activeId
                          ? "bg-white font-semibold text-slate-900 ring-1 ring-[var(--border)]"
                          : "text-slate-600 hover:bg-white/70",
                      ].join(" ")}
                    >
                      {module.title}
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
