"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Ticket, 
  Sparkles, 
  QrCode, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { DemoCardAnimated } from "./DemoCardAnimated";

const FALLBACK_SLIDES = [
  {
    id: "keynote",
    title: "West Africa Digital Banking Summit 2026",
    tagline: "Keynote & Stage Schedule",
    description: "Two days of talks, panel sessions, and live banking demos at Eko Hotel in Lagos.",
    image: "/images/keynote_lagos.jpg",
    city: "Eko Convention Centre, Lagos",
    date: "Sept 15, 2026",
    badge: "Keynote Summit",
    category: "Banking Keynote",
    accentColor: "#0090AD",
  },
  {
    id: "exhibition",
    title: "Fintech Core & Enterprise VAS Exposition",
    tagline: "Exhibition Booths & Live Demos",
    description: "Meet product teams from Bulkwave, Finedge, and SMERP. Test core banking and payment APIs on site.",
    image: "/images/exhibition_hall.jpg",
    city: "Landmark Event Centre, Lagos",
    date: "Sept 24, 2026",
    badge: "Expo Pavilion",
    category: "Expo Pavilion",
    accentColor: "#2563EB",
  },
  {
    id: "vip",
    title: "Founders & Banking Executive Roundtable",
    tagline: "Private Briefing Session",
    description: "Closed-door discussions on cross-border payments, compliance, and capital allocation across East and West Africa.",
    image: "/images/vip_lounge.jpg",
    city: "Villa Rosa Kempinski, Nairobi",
    date: "Oct 08, 2026",
    badge: "Executive Tier",
    category: "VIP Roundtable",
    accentColor: "#7E22CE",
  },
  {
    id: "doorpass",
    title: "Africa Cloud Architecture & DevOps Conference",
    tagline: "Technical Workshops & Demos",
    description: "Hands-on infrastructure sessions, database scaling patterns, and live architecture reviews.",
    image: "/images/qr_registration.jpg",
    city: "Transcorp Hilton, Abuja",
    date: "Oct 22, 2026",
    badge: "Cloud Summit",
    category: "Cloud Summit",
    accentColor: "#059669",
  },
];

export default function HeroSpotlightCarousel() {
  const { events } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = (events && events.length > 0)
    ? events.map((evt, idx) => ({
        id: evt.id,
        title: evt.title,
        tagline: evt.category,
        description: evt.description,
        image: evt.imageUrl && evt.imageUrl.startsWith("/") ? evt.imageUrl : (evt.imageUrl || FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].image),
        city: `${evt.location}, ${evt.city}`,
        date: evt.date,
        badge: evt.category,
        category: evt.category,
        accentColor: FALLBACK_SLIDES[idx % FALLBACK_SLIDES.length].accentColor,
      }))
    : FALLBACK_SLIDES;

  const total = slides.length;

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const slide = slides[currentSlide % total] || slides[0];

  return (
    <div className="relative w-full py-4">
      <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8">
        
        {/* Spotlight Card - Responsive sizing without squishing text */}
        <div 
          className="relative w-full xl:w-[calc(100%-460px)] 2xl:w-[calc(100%-500px)] max-w-4xl xl:max-w-[860px] h-auto md:h-[360px] xl:h-[420px] 2xl:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-white font-sans text-left z-10 mx-auto xl:mx-0 xl:ml-8 mr-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 h-full">
            
            {/* Details Pane (6 cols on md+ for generous breathing room) */}
            <div className="md:col-span-6 p-4 sm:p-6 lg:p-7 xl:p-8 flex flex-col justify-between h-full space-y-3 sm:space-y-4 bg-white border-b md:border-b-0 md:border-r border-slate-200/90 text-left order-1">
              <div className="space-y-2.5 sm:space-y-3">
                {/* Category & location header */}
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase">
                  <span className="font-bold text-[#0090AD] shrink-0">{slide.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium truncate">{slide.city}</span>
                </div>

                <h3 className="text-lg sm:text-xl xl:text-2xl font-bold tracking-tight text-slate-950 leading-snug">
                  {slide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
                  {slide.description}
                </p>
              </div>

              {/* Bottom Info & Navigation */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#0090AD] shrink-0" />
                    <span className="whitespace-nowrap">{slide.date}</span>
                  </div>

                  <Link
                    href={`/events/${slide.id || ""}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#162054] hover:bg-[#0f172a] text-white text-xs font-semibold transition-all shadow-xs shrink-0 whitespace-nowrap"
                  >
                    <span>View Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={cn(
                          "h-1.5 sm:h-2 rounded-full transition-all cursor-pointer",
                          i === (currentSlide % total)
                            ? "w-6 sm:w-7 bg-[#162054]"
                            : "w-1.5 sm:w-2 bg-slate-200 hover:bg-slate-300"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + total) % total)}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % total)}
                      className="p-1 sm:p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Rich Visual Hero Pane (6 cols on md+) */}
            <div className="md:col-span-6 relative h-48 sm:h-60 md:h-full overflow-hidden bg-slate-950 order-2 min-h-[190px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id || currentSlide}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={currentSlide === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />

                  {/* Natural Lighting Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Animated FifthEvents Demo Card - visible on both mobile and desktop */}
        <div className="w-full xl:w-auto flex items-center justify-center flex-shrink-0 mx-auto xl:mx-0 xl:mr-8 z-20">
          <DemoCardAnimated />
        </div>

      </div>
    </div>
  );
}
