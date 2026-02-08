"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Testimony = {
    id: number;
    name: string;
    credential: string;
    video: string;
    poster: string;
};

const testimonies: Testimony[] = [
    {
        id: 1,
        name: "Dr. Mohammed Malah",
        credential: "Master of Business Administration (MBA)",
        video: "/video/testimonies/1.mp4",
        poster: "/sliders/1.jpg",
    },
    {
        id: 2,
        name: "Ola Shoyele",
        credential: "Master of Public Administration (MPA)",
        video: "/video/testimonies/2.mp4",
        poster: "/sliders/2.jpg",
    },
    {
        id: 3,
        name: "Maryam Saraya",
        credential: "BSc. Economics",
        video: "/video/testimonies/1.mp4",
        poster: "/sliders/1.jpg",
    },
    {
        id: 4,
        name: "Dr. Iyke Malama",
        credential: "Master of Business Administration (MBA)",
        video: "/video/testimonies/1.mp4",
        poster: "/sliders/1.jpg",
    },
    {
        id: 5,
        name: "Henry Okoro",
        credential: "Public Administration (MPA)",
        video: "/video/testimonies/2.mp4",
        poster: "/sliders/2.jpg",
    },
    {
        id: 6,
        name: "David-Jang",
        credential: "BSc. Economics",
        video: "/video/testimonies/1.mp4",
        poster: "/sliders/1.jpg",
    },
];

const TestimoniesReel = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const dragStartX = useRef(0);
    const trackRef = useRef<HTMLDivElement | null>(null);
    const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
    const activeRef = useRef(activeIndex);
    const basePosters = testimonies.map((t) => t.poster);
    const [posterFrames, setPosterFrames] = useState([
        ...basePosters,
        ...basePosters,
    ]);
    const [cardWidth, setCardWidth] = useState(0);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const CARD_GAP = 16;
    const slides = [...testimonies, ...testimonies];

    const goToSlide = useCallback((index: number) => {
        setTransitionEnabled(true);
        setActiveIndex(index);
    }, []);

    const handlePointerDown = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement;
            if (target.closest("button")) {
                return;
            }
            setIsDragging(true);
            setTransitionEnabled(false);
            setDragOffset(0);
            dragStartX.current = event.clientX;
            event.currentTarget.setPointerCapture(event.pointerId);
        },
        [],
    );

    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!isDragging) return;
            const delta = event.clientX - dragStartX.current;
            setDragOffset(delta);
        },
        [isDragging],
    );

    const handlePointerUp = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!isDragging) return;
            const delta = event.clientX - dragStartX.current;
            const threshold = Math.max(cardWidth * 0.3, 60);
            if (delta > threshold) {
                goToSlide(activeRef.current - 1);
            } else if (delta < -threshold) {
                goToSlide(activeRef.current + 1);
            } else {
                setTransitionEnabled(true);
            }
            setDragOffset(0);
            setIsDragging(false);
            event.currentTarget.releasePointerCapture(event.pointerId);
        },
        [cardWidth, goToSlide, isDragging],
    );

    useEffect(() => {
        const measure = () => {
            const el = cardRef.current;
            if (!el) return;
            setCardWidth(el.offsetWidth);
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    useEffect(() => {
        if (!transitionEnabled) {
            const id = window.setTimeout(() => setTransitionEnabled(true), 50);
            return () => window.clearTimeout(id);
        }
    }, [transitionEnabled]);

    useEffect(() => {
        activeRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            const next = activeRef.current + 1;
            goToSlide(next);
        }, 60000);
        return () => window.clearInterval(timer);
    }, [goToSlide]);

    useEffect(() => {
        if (!activeVideo) return;
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setActiveVideo(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [activeVideo]);

    const handleMouseEnter = (index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {
                video.muted = true;
                video.play().catch(() => undefined);
            });
        }
    };

    const handleMouseLeave = (index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    return (
        <section className="bg-white py-5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">

                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
                    <div>
                        <p className="text-xs font-bold tracking-[0.4em]">TESTIMONIES</p>
                        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                            Testimonials from our graduates
                        </h2>
                        <p className="text-sm text-slate-600 mt-2 max-w-xl">
                            Listen to a few of our successful students and hear what they have
                            to say.
                        </p>
                    </div>
                    <button
                        className="text-sm font-semibold text-slate-900 transition hover:text-slate-700"
                        type="button"
                        onClick={() => goToSlide(0)}
                    >
                        More testimonies &gt;
                    </button>
                </div>

                <div className="mt-8 overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex gap-4"
                        style={{
                            transform: `translateX(-${cardWidth
                                ? (cardWidth + CARD_GAP) * activeIndex - dragOffset
                                : 0
                                }px)`,
                            transition: transitionEnabled ? "transform 0.7s ease" : "none",
                        }}
                        aria-live="polite"
                        onTransitionEnd={() => {
                            if (activeRef.current >= testimonies.length) {
                                setTransitionEnabled(false);
                                setActiveIndex(0);
                            }
                        }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                    >
                        {slides.map((item, idx) => (
                            <div
                                key={`${item.id}-${idx}`}
                                ref={idx === 0 ? cardRef : null}
                                className="min-w-[280px] flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-900/90 shadow-lg"
                                onMouseEnter={() => handleMouseEnter(idx)}
                                onMouseLeave={() => handleMouseLeave(idx)}
                                onTouchStart={() => handleMouseEnter(idx)}
                                onTouchEnd={() => handleMouseLeave(idx)}
                            >
                                <div className="relative h-56 w-full overflow-hidden rounded-t-2xl bg-slate-900">
                                    <video
                                        ref={(el) => {
                                            videoRefs.current[idx] = el;
                                        }}
                                        className="h-full w-full object-cover"
                                        src={item.video}
                                        poster={posterFrames[idx]}
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                        onLoadedData={() => {
                                            const video = videoRefs.current[idx];
                                            if (!video) return;
                                            const canvas = document.createElement("canvas");
                                            canvas.width = video.videoWidth || video.clientWidth;
                                            canvas.height = video.videoHeight || video.clientHeight;
                                            const ctx = canvas.getContext("2d");
                                            if (ctx) {
                                                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                                const dataUrl = canvas.toDataURL("image/png");
                                                setPosterFrames((prev) => {
                                                    const next = [...prev];
                                                    const baseIndex = idx % testimonies.length;
                                                    next[baseIndex] = dataUrl;
                                                    next[baseIndex + testimonies.length] = dataUrl;
                                                    return next;
                                                });
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                    <button
                                        type="button"
                                        className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
                                        aria-label="Play testimonial"
                                        onClick={(ev) => {
                                            ev.stopPropagation();
                                            setActiveVideo(item.video);
                                        }}
                                    >
                                        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-2xl transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 7 16 12l-7 5V7Z" fill="currentColor" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <div className="space-y-1 p-4 text-white">
                                    <p className="text-xs uppercase tracking-[0.4em] text-white/70">
                                        Graduate spotlight
                                    </p>
                                    <h3 className="text-xl font-semibold">{item.name}</h3>
                                    <p className="text-sm text-white/80">{item.credential}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {activeVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Testimonial video"
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className="relative w-full max-w-3xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                setActiveVideo(null);
                            }}
                            className="absolute z-70 right-0 top-0 m-3 cursor-pointer rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-900 shadow"
                        >
                            Close
                        </button>
                        <video
                            className="w-full rounded-2xl bg-black"
                            src={activeVideo}
                            controls
                            autoPlay
                            playsInline
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default TestimoniesReel;
