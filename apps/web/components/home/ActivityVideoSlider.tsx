"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

type ActivityVideo = {
  id: number;
  title: string;
  description: string;
  speaker: string;
  tag: string;
  image: string;
};

const videos: ActivityVideo[] = [
  {
    id: 1,
    title: "Key Moments from Bonny Vocational Center’s 2024 Matriculation",
    description:
      "Former Vice President Yemi Osinbajo inspired students with insights on leadership while we celebrated the campus’s ongoing commitment to access and inclusion.",
    speaker: "Sim Shagaya’s Address, Chancellor, Bonny Vocational Center",
    tag: "BVC Matriculation",
    image: "/sliders/1.jpg",
  },
  {
    id: 2,
    title: "Innovation in Technical Training",
    description:
      "A look inside our engineering labs where students collaborate, prototype, and launch projects that solve local challenges.",
    speaker: "Engineering Studio Tour",
    tag: "Campus Activities",
    image: "/sliders/2.jpg",
  },
  {
    id: 3,
    title: "Community Health Outreach Stories",
    description:
      "Healthcare students partner with community clinics to provide preventive care and build real-world experience.",
    speaker: "Community & Outreach",
    tag: "Health Initiative",
    image: "/sliders/3.jpg",
  },
];

const ActivityVideoSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const maxIndex = useMemo(() => videos.length - 1, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 < 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => window.clearInterval(timer);
  }, [maxIndex]);

  return (
    <section className="bg-[#f6f7fb]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-5">
        {/* <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#c94b43]">
                        Activity Highlights
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Watch how Bonny Vocational Center shapes practical learning
                    </h2>
                </div> */}

        <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_rgba(15,23,42,0.12)]">
          <div className="absolute right-6 top-6 flex items-center gap-2">
            <button
              aria-label="Show previous video"
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-white/80 text-slate-900 shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-slate-400"
            >
              <span className="sr-only">Previous</span>
              <svg className="mx-auto h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 6 9 12l6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              aria-label="Show next video"
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-white/80 text-slate-900 shadow-lg transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400"
            >
              <span className="sr-only">Next</span>
              <svg className="mx-auto h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6 15 12l-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {videos.map((video) => (
              <div key={video.id} className="min-w-full">
                <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_1fr]">
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={video.image}
                      alt={video.title}
                      width={950}
                      height={520}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
                        <svg
                          className="h-8 w-8 text-[#c94b43]"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path d="M10 8 16 12l-6 4v-8Z" fill="currentColor" />
                        </svg>
                      </span>
                    </div>
                    <p className="absolute left-6 bottom-6 text-lg font-semibold text-white">
                      {video.speaker}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between rounded-2xl bg-white/70 p-6 shadow-inner">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c94b43]">
                        {video.tag}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold text-slate-900">
                        {video.title}
                      </h3>
                      <p className="mt-4 text-base text-slate-600">
                        {video.description}
                      </p>
                    </div>
                    <div className="mt-6 text-sm font-semibold text-slate-500">
                      {video.tag} · {video.speaker}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityVideoSlider;
