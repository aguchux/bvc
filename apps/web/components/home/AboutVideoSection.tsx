// app/components/AboutVideoSection.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";

type AboutVideoSectionProps = {
  kicker?: string;
  title?: string;
  description?: string;
  videoUrl?: string; // YouTube/Vimeo/embed or mp4 URL
  posterSrc?: string; // /public/... or remote image
  posterAlt?: string;
  caption?: string;
};

function isYouTube(url: string) {
  return /youtu\.be|youtube\.com/.test(url);
}
function isVimeo(url: string) {
  return /vimeo\.com/.test(url);
}
function toEmbedUrl(url: string) {
  try {
    // If already an embed URL, keep it.
    if (url.includes("/embed/") || url.includes("player.vimeo.com")) return url;

    // YouTube watch URL or youtu.be -> embed
    if (isYouTube(url)) {
      const u = new URL(url);
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // youtu.be/<id>
      const id = u.pathname.replace("/", "").trim();
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo -> embed
    if (isVimeo(url)) {
      const u = new URL(url);
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return url;
  } catch {
    return url;
  }
}

export default function AboutVideoSection({
  kicker = "Introducing Bonny Vocational Center",
  title = "Reviewing highlights from the 2026 Bonny Vocational Center launch Ceremony",
  description = `In 2024, Bonny Vocational Center was inaugurated to provide world-class vocational training and empower the next generation of skilled professionals. Watch highlights from the launch ceremony where we unveiled our state-of-the-art facilities and shared our vision for practical, hands-on education.`,
  videoUrl = "/video/v1.mp4",
  posterSrc = "/sliders/1.jpg",
  posterAlt = "About video poster",
  caption = "Administrative team of Bonny Vocational Center at the launch ceremony",
}: AboutVideoSectionProps) {
  const [open, setOpen] = useState(false);

  const embedUrl = useMemo(() => {
    const url = toEmbedUrl(videoUrl);
    // add autoplay for embeds when opened
    const hasQuery = url.includes("?");
    if (url.includes("youtube.com/embed/")) {
      return url + (hasQuery ? "&" : "?") + "autoplay=1&rel=0&modestbranding=1";
    }
    if (url.includes("player.vimeo.com/video/")) {
      return (
        url + (hasQuery ? "&" : "?") + "autoplay=1&title=0&byline=0&portrait=0"
      );
    }
    return url;
  }, [videoUrl]);

  return (
    <section className="py-14 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Video card */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-[0_14px_40px_rgba(15,23,42,0.14)] ring-1 ring-slate-200">
              <div className="relative aspect-video w-full">
                <Image
                  src={posterSrc}
                  alt={posterAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 560px"
                  priority={false}
                />

                {/* subtle overlay like template */}
                <div className="absolute inset-0 bg-slate-900/35" />

                {/* Play button */}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="absolute inset-0 grid place-items-center"
                  aria-label="Play video"
                >
                  <span className="grid h-20 w-20 cursor-pointer place-items-center rounded-full bg-white/90 shadow-lg ring-8 ring-white/25 transition group-hover:scale-105">
                    <Play
                      className="h-7 w-7 translate-x-0.5 text-[#0F5E78]"
                      fill="currentColor"
                    />
                  </span>
                </button>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-base font-semibold text-white drop-shadow">
                    {caption}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="text-lg font-bold text-[#0F5E78]">{kicker}</p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h2>

            <p className="mt-5 max-w-prose leading-7 text-slate-600">
              {description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Watch Video
              </button>

              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-[#0F5E78] px-5 py-3 text-sm text-white font-semibold shadow-sm transition hover:bg-[#1a9ac5] "
              >
                Learn more
              </a>
            </div>
          </div>
        </div>

        {/* Modal */}
        {open ? (
          <div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Video modal"
          >
            <button
              aria-label="Close video"
              className="absolute inset-0 bg-black/70"
              onClick={() => setOpen(false)}
              type="button"
            />
            <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <p className="text-sm font-semibold text-white/90">Video</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="aspect-video w-full">
                {embedUrl.endsWith(".mp4") ? (
                  <video className="h-full w-full" controls autoPlay>
                    <source src={videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <iframe
                    className="h-full w-full"
                    src={embedUrl}
                    title="About video"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
