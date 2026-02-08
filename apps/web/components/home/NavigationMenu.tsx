"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import UtilityMenu from "./UtilityMenu";
import MainMenuBar from "./MainMenuBar";
import { dictionary } from "../../lib/lang";
// removed: import MainMenuBar

/* New: MenuBar (utility square items + main nav + mega-menu) */
export function NavigationMenu() {
  const [megaOpen, setMegaOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  // const megaId = "academics-mega";
  const firstMegaLinkRef = useRef<HTMLAnchorElement | null>(null);
  // const openTimer = useRef<number | null>(null);
  // const closeTimer = useRef<number | null>(null);
  const academicsButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [caretLeft, setCaretLeft] = useState<number | null>(null);

  // open/close and focus management (kept lightweight)
  useEffect(() => {
    if (!megaOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!navRef.current.contains(e.target)) setMegaOpen(false);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") setMegaOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    firstMegaLinkRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  // caret positioning (clamped)
  useEffect(() => {
    if (!megaOpen) return setCaretLeft(null);
    const compute = () => {
      const btn = academicsButtonRef.current;
      const panel = panelRef.current;
      if (!btn || !panel) return setCaretLeft(null);
      const btnR = btn.getBoundingClientRect();
      const panelR = panel.getBoundingClientRect();
      const raw = btnR.left + btnR.width / 2 - panelR.left;
      const EDGE_GAP = 20;
      setCaretLeft(
        Math.round(
          Math.min(
            Math.max(raw, EDGE_GAP),
            Math.max(EDGE_GAP, panelR.width - EDGE_GAP),
          ),
        ),
      );
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("scroll", compute, { passive: true });
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("scroll", compute);
    };
  }, [megaOpen]);

  return (
    <>
      {/* Utility strip (square items) */}
      <div className="bg-[#072a3a] text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-3 py-2">
          {/* logo left column keeps same height as utility bar */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0">
              <Image
                src="/logo.png"
                alt="Bonny Vocational Center"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="leading-tight">
              <div className="hidden md:block text-sm text-white/90 font-bold">
                {dictionary.en.config.site_name}
              </div>
              <div className="hidden md:block text-sm text-white/90">
                {dictionary.en.config.site_short_slogan}
              </div>
            </div>
          </div>

          {/* square utility items */}
          <UtilityMenu />
          {/* spacer to push contact/apply right */}
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-sm text-white/90">
              <Link
                href={
                  "https://wa.me/2349132300000?text=" +
                  encodeURIComponent(
                    `Hello — I'm contacting ${dictionary.en.config.site_name} about admissions.`,
                  )
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded px-4 py-2 bg-[#083a4a]/30 hover:bg-[#0a515f] focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Message us on WhatsApp"
                title="Message us on WhatsApp"
              >
                {/* WhatsApp mark (small, unobtrusive) */}
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M21 11.5A9.5 9.5 0 1 0 6 20l-1.6 4L9 19.5A9.5 9.5 0 0 0 21 11.5z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 14.2c-.3-.1-1.7-.8-2-.9-.3-.1-.6-.1-.9.1-.3.3-1.1.9-1.4 1.1-.3.1-.5.2-.8-.2-.3-.4-1.1-1.5-1.5-2-.4-.5 0-.8.3-1.1.3-.3.6-.6.9-.9.3-.3.5-.5.8-.8.3-.3.2-.6 0-.8-.2-.3-.9-2.1-1.3-2.8-.3-.7-.7-.6-1-.6-.3 0-.6 0-.9 0s-1 .1-1.5.7c-.5.6-1.8 1.8-1.8 4.3 0 2.5 1.9 4.9 2.2 5.2.3.3 3.6 5.4 8.9 3.8 1.7-.6 2.8-2.1 3.2-2.4.4-.3 1.1-1.3 1.2-2.4.1-1.2-.7-1.8-1-1.9z"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">+234 913 230 0000</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Primary nav + mega menu (square / boxy styling) */}
      <MainMenuBar />
    </>
  );
}
