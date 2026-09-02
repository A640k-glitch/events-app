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

const SPOTLIGHT_SLIDES = [
  {
    id: "keynote",
    title: "West Africa Digital Banking Summit 2026",
    tagline: "Keynote Indexing • WAT Synchronized",
    description: "Multi-track fintech keynote indexed with real-time door badge scanning and 1-on-1 executive demo routing across Lagos & Abuja.",
    image: "/images/keynote_lagos.jpg",
    city: "Lagos, Nigeria",
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
    city: "Abuja, Nigeria",
    date: "Sept 24, 2026",
    badge: "48 Qualified Leads",
    category: "Expo Pavilion",
    accentColor: "#2563EB",
  },
  {
    id: "vip",
    title: "Founders & Banking Executive Roundtable",
    tagline: "VIP Access & Cross-Border Briefings",
    description: "Private executive lounges and strategic briefings with unified attendee credentials and encrypted NDPR compliance.",
    image: "/images/vip_lounge.jpg",
    city: "Nairobi, Kenya",
    date: "Oct 08, 2026",
    badge: "Executive Tier",
    category: "VIP Roundtable",
    accentColor: "#7E22CE",
  },
  {
    id: "doorpass",
    title: "Sub-Second Digital Pass Verification Desk",
    tagline: "0.8s Door Scan • Cryptographic QR Passes",
    description: "Automated door check-in desk eliminating venue queues with live operations manifest synchronization.",
    image: "/images/qr_registration.jpg",
    city: "Accra, Ghana",
    date: "Oct 22, 2026",
    badge: "98.4% Verified",
    category: "Pass Desk",
    accentColor: "#059669",
  },
];

export default function HeroSpotlightCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = SPOTLIGHT_SLIDES.length;

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const slide = SPOTLIGHT_SLIDES[currentSlide];

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
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
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
                {SPOTLIGHT_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={cn(
                      "h-2 rounded-full transition-all cursor-pointer",
                      i === currentSlide
                        ? "w-7 bg-[#0090AD]"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    )}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + total) % total)}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors cursor-pointer"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % total)}
                  className="p-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs transition-colors cursor-pointer"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Rich Natural-Lighting Photography with Overlays (7 cols) */}
        <div className="lg:col-span-7 relative min-h-[220px] lg:min-h-[380px] overflow-hidden bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
              
              {/* Bottom Live Tag on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
                <div className="flex items-center gap-2 text-xs font-semibold bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <MapPin className="w-3.5 h-3.5 text-[#20B2AA]" />
                  <span>{slide.city}</span>
                </div>

                <span className="text-[11px] font-mono font-bold bg-[#0090AD] px-3 py-1 rounded-full text-white shadow-xs">
                  {slide.tagline}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
