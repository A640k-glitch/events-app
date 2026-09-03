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
    tagline: "Keynote Agenda & Speaker Indexing",
    description: "Multi-track fintech keynote indexed with real-time door badge scanning and 1-on-1 executive demo routing across Lagos & Abuja.",
    image: "/images/keynote_lagos.jpg",
    city: "Eko Convention Centre, Lagos",
    date: "Sept 15, 2026",
    badge: "2,500+ RSVPs",
    category: "Banking Keynote",
    accentColor: "#0090AD",
  },
  {
    id: "exhibition",
    title: "Fintech Core & Enterprise VAS Exposition",
    tagline: "Live Booth Acquisition & CRM Sync",
    description: "Direct booth visitor lead capture with instant CRM routing to engineering specialists for Bulkwave, Finedge, and SMERP.",
    image: "/images/exhibition_hall.jpg",
    city: "Landmark Event Centre, Lagos",
    date: "Sept 24, 2026",
    badge: "1,800+ RSVPs",
    category: "Expo Pavilion",
    accentColor: "#2563EB",
  },
  {
    id: "vip",
    title: "Founders & Banking Executive Roundtable",
    tagline: "VIP Access & Cross-Border Briefings",
    description: "Private executive lounges and strategic briefings with unified attendee credentials and encrypted NDPR compliance.",
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
    tagline: "0.8s Cryptographic Door Verification",
    description: "High-throughput cloud architecture, microservices scaling, and cryptographic QR access badge engineering.",
    image: "/images/qr_registration.jpg",
    city: "Transcorp Hilton, Abuja",
    date: "Oct 22, 2026",
    badge: "1,200+ RSVPs",
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
        badge: `${evt.expectedAttendance || 1200}+ RSVPs`,
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
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-8">
        
        {/* Spotlight Card - matching height with right Demo Card */}
        <div 
          className="relative w-full lg:w-[calc(100%-420px)] xl:w-[calc(100%-480px)] 2xl:w-[calc(100%-520px)] max-w-4xl xl:max-w-[860px] lg:h-[380px] xl:h-[440px] 2xl:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white font-sans text-left z-10 mx-auto lg:mx-0 lg:ml-8 xl:ml-12 mr-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full min-h-[340px] sm:min-h-[380px]">
            
            {/* Left: Interactive Details Pane (5 cols) in Clean CWG Style */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between h-full space-y-4 bg-white border-b lg:border-b-0 lg:border-r border-slate-200/90 text-left">
              <div className="space-y-3.5">
                {/* Clean CWG category & location header without pill containers */}
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider uppercase">
                  <span className="font-bold text-[#0090AD]">{slide.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 font-medium truncate max-w-[220px]">{slide.city}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 leading-snug">
                  {slide.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {slide.description}
                </p>
              </div>

              {/* Bottom Info & Navigation */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 font-mono">
                    <Calendar className="w-4 h-4 text-[#0090AD]" />
                    <span>{slide.date}</span>
                  </div>

                  <Link
                    href={`/events/${slide.id || ""}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#162054] hover:bg-[#0f172a] text-white text-xs font-semibold transition-all shadow-xs"
                  >
                    <span>View Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={cn(
                          "h-2 rounded-full transition-all cursor-pointer",
                          i === (currentSlide % total)
                            ? "w-7 bg-[#162054]"
                            : "w-2 bg-slate-200 hover:bg-slate-300"
                        )}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + total) % total)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % total)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Rich Visual Hero Pane (7 cols) - Clean CWG Enterprise Photo */}
            <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full overflow-hidden bg-slate-950">
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
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />

                  {/* Natural Lighting Gradient Overlays without fake floating tags */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Animated FifthEvents Demo Card - visible on both mobile and desktop */}
        <div className="flex items-center justify-center flex-shrink-0 mx-auto lg:mx-0 mr-auto lg:mr-8 xl:mr-12 z-20">
          <DemoCardAnimated />
        </div>

      </div>
    </div>
  );
}
