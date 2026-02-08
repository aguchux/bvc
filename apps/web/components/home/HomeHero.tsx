"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import TopLinksSlimBar from "./TopLinksSlimBar";
import { dictionary } from "../../lib/lang";
import { Icon, slides } from "../../constants/home";
import UtilityMenu from "./UtilityMenu";
import SmartApply from "./SmartApply";
import MainMenuBar from "./MainMenuBar";
import HeroBandBanner from "./HeroBandBanner";
// removed: import MainMenuBar

/* ------------------------------------------------------------------
  Replace previous MainMenuBar usage with the new MenuBar — keep hero
  logic unchanged below.
------------------------------------------------------------------- */

export default function HomeHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // autoplay (timeout) — avoids stale-closure issues and is easy to pause/resume
  useEffect(() => {
    if (isPaused) return;
    const t = window.setTimeout(() => {
      setCurrentSlide((s) => (s + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(t);
  }, [currentSlide, isPaused]);

  const pauseAutoplay = () => setIsPaused(true);
  const resumeAutoplay = () => setIsPaused(false);

  return (
    <>
      <main className="relative">
        {/* Background slider + overlay (integrated hero slider) */}
        <div
          className="relative w-full overflow-hidden h-80 sm:h-105 md:h-100 lg:h-100"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          aria-roledescription="carousel"
          tabIndex={0}
          onFocus={pauseAutoplay}
          onBlur={resumeAutoplay}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft")
              setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);
            if (e.key === "ArrowRight")
              setCurrentSlide((s) => (s + 1) % slides.length);
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              /* active slide must sit above the other slides; slides keep pointer-events-none so foreground is interactive */
              className={`absolute inset-0 transition-opacity duration-800 ease-[cubic-bezier(.2,.9,.2,1)] pointer-events-none ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              aria-hidden={index === currentSlide ? "false" : "true"}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gray-900/70 md:bg-gray-900/20" />
            </div>
          ))}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden h-full w-[70%] rounded-br-[320px] bg-[#072A3A]/95 opacity-80 md:block"
            style={{ clipPath: "ellipse(70% 120% at 0% 50%)" }}
          />

          {/* centered bottom line-bar indicators (clickable + keyboard accessible) */}
          <div
            className="absolute left-1/2 bottom-6 z-40 -translate-x-1/2 flex items-center gap-3 pointer-events-auto"
            role="tablist"
            aria-label="Slide indicators"
          >
            {slides.map((_, i) => {
              const active = i === currentSlide;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active || undefined}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1 rounded-full bg-white/40 transition-all cursor-pointer duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
                    active ? "w-14 bg-green-500" : "w-6 hover:w-10"
                  }`}
                >
                  <span className="sr-only">
                    {active ? `Current slide ${i + 1}` : `Slide ${i + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Foreground content */}
        {/* bring foreground above slides and allow interactions (slides are non-interactive) */}
        <div className="absolute inset-0 z-30 hi">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-10 pt-10 md:pt-16 lg:grid-cols-[1.2fr_.8fr]">
            {/* Left: headline */}
            <section
              className="pointer-events-auto self-center lg:max-w-2xl lg:pr-8"
              role="region"
              aria-label="Hero slide content"
            >
              <div className="flex items-center gap-2 text-white/90">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                  <Icon name="cap" />
                </span>
                <span className="text-sm font-semibold">
                  Welcome to Bonny Vocational Center
                </span>
              </div>

              {/* slide-driven headline + CTA — render all slides but only the active one is visible/interactive */}
              <div className="relative mt-4 max-w-xl">
                {slides.map((s, i) => {
                  const active = i === currentSlide;
                  return (
                    <div
                      key={s.id}
                      className={`transition-all duration-500 ease-[cubic-bezier(.2,.9,.2,1)] transform ${
                        active
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-3 pointer-events-none absolute inset-0"
                      }`}
                      aria-hidden={!active}
                    >
                      <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl">
                        {s.title.split("\n").map((line, idx) => (
                          <React.Fragment key={idx}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </h1>

                      <div className="mt-6">
                        <Link
                          href={s.href ?? "/courses"}
                          className="inline-flex items-center gap-2 rounded-full bg-[#0F5E78] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                        >
                          {s.buttonText}
                          <span className="opacity-90">::</span>
                        </Link>
                        {/* Contact Admissions */}
                        <Link
                          href="/contact"
                          className="ml-4 inline-flex items-center gap-2 rounded-full bg-green-600/60 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95"
                        >
                          Contact Admissions Advisor
                          <span className="opacity-90">
                            <Icon name="arrow" />
                          </span>
                        </Link>
                        {/* Contact Admissions */}
                      </div>
                    </div>
                  );
                })}

                {/* SR-only live region so screen readers announce slide changes */}
                <span className="sr-only" aria-live="polite">
                  {slides[currentSlide]?.title}
                </span>
              </div>
            </section>

            {/* Right: Smart Apply */}
            <SmartApply />
          </div>
        </div>

        {/* Mobile spacing so stacked cards don't cover hero */}
        <div className="h-[220px] md:hidden" />
      </main>
      <HeroBandBanner />
    </>
  );
}
