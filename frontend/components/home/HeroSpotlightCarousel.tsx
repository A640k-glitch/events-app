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

const FALLBACK_SLIDES = [
  {
    id: "keynote",
    title: "West Africa Digital Banking Summit 2026",
    tagline: "Keynote Indexing • WAT Synchronized",
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
    tagline: "WAT Synchronized • 0.8s Door Verification",
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
        tagline: `${evt.category} • WAT Synchronized`,
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
    <div 
      className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-white font-sans text-left"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[340px] sm:min-h-[380px]">
        
        {/* Left: Interactive Details Pane (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E8F8FA] border border-[#20B2AA]/30 text-[#00829B] text-[11px] font-mono font-bold">
                {slide.category}
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-semibold truncate max-w-[200px]">
                {slide.city}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
              {slide.title}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {slide.description}
            </p>
          </div>

          {/* Bottom Info & Quick Navigation */}
          <div className="space-y-4 pt-4 border-t border-slate-200/80">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#0090AD]" />
                <span>{slide.date}</span>
              </div>
              <span className="text-xs font-bold text-emerald-700 font-mono bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {slide.badge}
              </span>
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
                        ? "w-7 bg-[#0090AD]"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + total) % total)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % total)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rich Visual Hero Pane (7 cols) */}
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto overflow-hidden bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id || currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />

              {/* Natural Lighting & Atmospheric Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden lg:block" />

              {/* Live Badge Overlays */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#00B4D8] animate-pulse" />
                  <span>WAT SYNCHRONIZED</span>
                </div>
              </div>

              {/* Card Bottom Tagline */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider">
                    OPERATIONAL FOCUS
                  </span>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00B4D8]" />
                    <span>{slide.tagline}</span>
                  </div>
                </div>

                <Link
                  href="/events"
                  className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
