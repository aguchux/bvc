"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Icon, NavLinkMenuType, navLinks } from "../../constants/home";

const MainMenuBar = () => {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const megaId = "academics-mega";
  const firstMegaLinkRef = useRef<HTMLAnchorElement | null>(null);

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownCloseTimer = useRef<number | null>(null);

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  const showDropdown = (idx: number) => {
    if (dropdownCloseTimer.current)
      window.clearTimeout(dropdownCloseTimer.current);
    setActiveDropdown(idx);
  };

  const hideDropdown = () => {
    if (dropdownCloseTimer.current)
      window.clearTimeout(dropdownCloseTimer.current);
    dropdownCloseTimer.current = window.setTimeout(
      () => setActiveDropdown(null),
      180,
    );
  };

  const toggleDropdown = (idx: number) => {
    if (dropdownCloseTimer.current)
      window.clearTimeout(dropdownCloseTimer.current);
    setActiveDropdown((prev) => (prev === idx ? null : idx));
  };

  const handleDropdownKey = (
    ev: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    if (ev.key === "ArrowDown" || ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      showDropdown(idx);
    } else if (ev.key === "Escape") {
      setActiveDropdown(null);
    }
  };

  const [caretLeft, setCaretLeft] = useState<number | null>(null);

  const academicsButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // close on outside click / Escape
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
    // focus first link for keyboard users
    firstMegaLinkRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [megaOpen]);

  useEffect(() => {
    if (activeDropdown === null) return;
    const onDoc = (e: MouseEvent) => {
      if (!navRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!navRef.current.contains(e.target)) setActiveDropdown(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
    };
  }, [activeDropdown]);

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (dropdownCloseTimer.current)
        window.clearTimeout(dropdownCloseTimer.current);
    };
  }, []);

  // position caret under the Academics button when panel opens / on resize/scroll
  useEffect(() => {
    if (!megaOpen) return setCaretLeft(null);
    const compute = () => {
      const btn = academicsButtonRef.current;
      const panel = panelRef.current;
      if (!btn || !panel) return setCaretLeft(null);
      const btnR = btn.getBoundingClientRect();
      const panelR = panel.getBoundingClientRect();
      setCaretLeft(Math.round(btnR.left + btnR.width / 2 - panelR.left));
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
    <header className="relative z-40 backdrop-blur" id="main-menu-bar">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <nav
          ref={navRef as React.RefObject<HTMLElement>}
          className="hidden items-center gap-8 lg:flex z-10"
          aria-label="Primary"
        >
          {navLinks.map((l: NavLinkMenuType, idx) => {
            const normalizedPath = (pathname ?? "").replace(/\/$/, "");
            const baseHref = l.href ?? "";
            const hasSubMenus =
              Array.isArray(l.subMenus) && l.subMenus.length > 0;
            const hasActiveChild = l.subMenus?.some((sub) => {
              if (!sub.href || sub.href === "#") return false;
              return normalizedPath.startsWith(sub.href);
            });
            const isActiveMain =
              baseHref &&
              baseHref !== "#" &&
              normalizedPath.startsWith(baseHref);
            const isActiveGroup = isActiveMain || !!hasActiveChild;
            const dropdownId = `nav-link-dropdown-${idx}`;
            const isDropdownOpen = activeDropdown === idx;

            if (l.menuType === "mega" && hasSubMenus) {
              return (
                <div
                  key={l.label ?? idx}
                  className="relative"
                  onMouseEnter={() => {
                    if (closeTimer.current)
                      window.clearTimeout(closeTimer.current);
                    openTimer.current = window.setTimeout(
                      () => setMegaOpen(true),
                      80,
                    );
                  }}
                  onMouseLeave={() => {
                    if (openTimer.current)
                      window.clearTimeout(openTimer.current);
                    closeTimer.current = window.setTimeout(
                      () => setMegaOpen(false),
                      180,
                    );
                  }}
                >
                  <button
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                    aria-controls={megaId}
                    ref={academicsButtonRef}
                    onClick={(ev) => {
                      ev.preventDefault();
                      setMegaOpen((s) => !s);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setMegaOpen(true);
                      }
                    }}
                    className="inline-flex h-full cursor-pointer items-center gap-2 text-[15px] font-medium text-slate-700 hover:text-slate-900"
                  >
                    {l.label ?? "Academics"}
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {isActiveGroup && (
                    <span className="pointer-events-none absolute -bottom-1 left-0 right-0 mx-auto h-1 w-12 rounded-full bg-[#0f5e78]" />
                  )}
                  {/* Dropdown */}
                  <div
                    id={megaId}
                    ref={panelRef}
                    role="region"
                    aria-label="Academics Menu"
                    className={`absolute left-1/2 top-full z-20 mt-3 w-screen max-w-lg -translate-x-1/2 rounded-xl bg-white p-6 shadow-lg transition-opacity duration-200 ${
                      megaOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                    onMouseEnter={() => {
                      if (closeTimer.current)
                        window.clearTimeout(closeTimer.current);
                      openTimer.current = window.setTimeout(
                        () => setMegaOpen(true),
                        80,
                      );
                    }}
                    onMouseLeave={() => {
                      if (openTimer.current)
                        window.clearTimeout(openTimer.current);
                      closeTimer.current = window.setTimeout(
                        () => setMegaOpen(false),
                        180,
                      );
                    }}
                  >
                    {/* Caret */}
                    <div
                      className="absolute -top-1.5 left-0 w-full overflow-hidden pointer-events-none"
                      aria-hidden="true"
                    >
                      <div
                        className="mx-auto h-3 w-3 rotate-45 bg-white shadow-md"
                        style={
                          caretLeft !== null
                            ? { left: caretLeft, marginLeft: "-6px" }
                            : {}
                        }
                      />
                    </div>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {l.subMenus?.map((s, sidx) => (
                        <li key={s.label ?? sidx}>
                          <Link
                            href={s.href}
                            ref={sidx === 0 ? firstMegaLinkRef : null}
                            className="block rounded-lg p-3 hover:bg-slate-50"
                          >
                            <div className="font-medium text-slate-900">
                              {s.label}
                            </div>
                            {/* rounded gradient */}
                            {/* rounded gradient */}
                            {s.description ? (
                              <p className="mt-1 text-sm text-slate-500">
                                {s.description}
                              </p>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Dropdown */}
                </div>
              );
            }

            if (l.menuType === "grid" && hasSubMenus) {
              return (
                <div
                  key={l.label ?? idx}
                  className="relative"
                  onMouseEnter={() => showDropdown(idx)}
                  onMouseLeave={hideDropdown}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    aria-controls={dropdownId}
                    onClick={() => toggleDropdown(idx)}
                    onKeyDown={(ev) => handleDropdownKey(ev, idx)}
                    className={`inline-flex h-full cursor-pointer items-center gap-2 text-[15px] font-medium ${isActiveGroup ? "text-[#0f5e78]" : "text-slate-700"} hover:text-slate-900`}
                  >
                    {l.label}
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {isActiveGroup && (
                    <span className="pointer-events-none absolute -bottom-1 left-0 right-0 mx-auto h-1 w-10 rounded-full bg-[#0f5e78]" />
                  )}
                  {isActiveGroup && (
                    <span className="pointer-events-none absolute -bottom-1 left-0 right-0 mx-auto h-1 w-10 rounded-full bg-[#0f5e78]" />
                  )}
                  <div
                    id={dropdownId}
                    role="menu"
                    aria-label={`${l.label} menu`}
                    aria-hidden={!isDropdownOpen}
                    className={`absolute left-1/2 top-full z-20 mt-3 w-screen max-w-5xl -translate-x-1/2 rounded-2xl bg-white p-6 shadow-lg transition-all duration-200 ${
                      isDropdownOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none scale-95"
                    }`}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {l.subMenus!.map((item, itemIdx) => (
                        <Link
                          key={item.label ?? itemIdx}
                          href={item.href}
                          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400"
                        >
                          <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                            {item.bannerImage ? (
                              <Image
                                src={item.bannerImage}
                                alt={item.label}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
                            )}
                          </div>
                          <div className="flex flex-1 flex-col gap-1 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                              {item.label}
                            </p>
                            {item.description ? (
                              <p className="text-xs text-slate-500">
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            if (l.menuType === "list" && hasSubMenus) {
              return (
                <div
                  key={l.label ?? idx}
                  className="relative"
                  onMouseEnter={() => showDropdown(idx)}
                  onMouseLeave={hideDropdown}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    aria-controls={dropdownId}
                    onClick={() => toggleDropdown(idx)}
                    onKeyDown={(ev) => handleDropdownKey(ev, idx)}
                    className="inline-flex h-full cursor-pointer items-center gap-2 text-[15px] font-medium text-slate-700 hover:text-slate-900"
                  >
                    {l.label}
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div
                    id={dropdownId}
                    role="menu"
                    aria-label={`${l.label} menu`}
                    aria-hidden={!isDropdownOpen}
                    className={`absolute left-0 top-full z-20 mt-2 min-w-[220px] rounded-xl bg-white p-3 shadow-lg transition-all duration-200 ${
                      isDropdownOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none scale-95"
                    }`}
                  >
                    <ul className="space-y-1 text-sm">
                      {l.subMenus!.map((item, itemIdx) => (
                        <li key={item.label ?? itemIdx}>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                          >
                            <div className="font-medium">{item.label}</div>
                            {item.description ? (
                              <p className="text-xs text-slate-500">
                                {item.description}
                              </p>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }

            return (
              <div key={l.label ?? idx} className="relative">
                <Link
                  href={l.href}
                  className={`inline-flex cursor-pointer items-center gap-2 text-[15px] font-medium ${isActiveGroup ? "text-[#0f5e78]" : "text-slate-700"}`}
                >
                  {l.label}
                </Link>
                {isActiveGroup && (
                  <span className="pointer-events-none absolute -bottom-1 left-0 right-0 mx-auto h-1 w-10 rounded-full bg-[#0f5e78]" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-1 justify-between lg:justify-end">
          <button
            className="inline-flex rounded-full p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Menu"
          >
            <Icon name="menu" />
          </button>

          <Link
            href="/apply"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f5e78] px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:opacity-95"
          >
            <span className="text-white hover:text-gray-300">
              Apply <span>Now</span> <Icon name="arrow" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MainMenuBar;
