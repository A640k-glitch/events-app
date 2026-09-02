"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroCardItem {
  id: string;
  name: string;
  product: string;
  category: string;
  city: string;
  date: string;
  statNumber: string;
  statLabel: string;
  gradient: string;
  badgeBg: string;
  badgeColor: string;
  iconBg: string;
  accentColor: string;
  statusText: string;
  statusType: "success" | "teal" | "purple" | "amber";
}

const HERO_CARDS: HeroCardItem[] = [
  {
    id: "kuleanpay",
    name: "Kuleanpay Rail Gateway",
    product: "Kuleanpay",
    category: "Payment Summit",
    city: "Lagos",
    date: "Sept 12",
    statNumber: "1,200",
    statLabel: "Delegates Registered",
    gradient: "from-[#F5F3FF] via-[#EDE9FE] to-[#DDD6FE]",
    badgeBg: "bg-purple-100",
    badgeColor: "text-purple-800 border-purple-200",
    iconBg: "bg-[#4338CA]",
    accentColor: "#4338CA",
    statusText: "98.4% Check-in",
    statusType: "purple",
  },
  {
    id: "bulkwave",
    name: "Bulkwave Core Payments",
    product: "Bulkwave",
    category: "Keynote Expo",
    city: "Abuja",
    date: "Sept 18",
    statNumber: "42",
    statLabel: "Leads Captured",
    gradient: "from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]",
    badgeBg: "bg-blue-100",
    badgeColor: "text-blue-800 border-blue-200",
    iconBg: "bg-[#2563EB]",
    accentColor: "#2563EB",
    statusText: "Live Door Scan",
    statusType: "teal",
  },
  {
    id: "finedge",
    name: "Finedge Core Banking",
    product: "Finedge",
    category: "Digital Banking Forum",
    city: "Lagos",
    date: "Sept 24",
    statNumber: "2,500",
    statLabel: "Confirmed Attendees",
    gradient: "from-[#ECFDF5] via-[#E6F8FB] to-[#CCFBF1]",
    badgeBg: "bg-[#20B2AA]/20",
    badgeColor: "text-[#00829B] border-[#20B2AA]/30",
    iconBg: "bg-[#20B2AA]",
    accentColor: "#20B2AA",
    statusText: "Featured Summit",
    statusType: "success",
  },
  {
    id: "ucp",
    name: "UCP Unified Channel Platform",
    product: "UCP",
    category: "Fintech Exposition",
    city: "Nairobi",
    date: "Oct 04",
    statNumber: "850",
    statLabel: "Executive Briefings",
    gradient: "from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]",
    badgeBg: "bg-cyan-100",
    badgeColor: "text-cyan-800 border-cyan-200",
    iconBg: "bg-[#0284C7]",
    accentColor: "#0284C7",
    statusText: "WAT Synchronized",
    statusType: "teal",
  },
  {
    id: "beetvas",
    name: "BEETVAS Enterprise Gateway",
    product: "BEETVAS",
    category: "Executive Summit",
    city: "Accra",
    date: "Oct 15",
    statNumber: "28",
    statLabel: "Demo Requests",
    gradient: "from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]",
    badgeBg: "bg-slate-100",
    badgeColor: "text-slate-800 border-slate-200",
    iconBg: "bg-[#334155]",
    accentColor: "#334155",
    statusText: "Door Pass Active",
    statusType: "amber",
  },
  {
    id: "smerp",
    name: "SMERP GO Business Suite",
    product: "SMERP GO",
    category: "Growth Conference",
    city: "Kigali",
    date: "Oct 28",
    statNumber: "1,400",
    statLabel: "Registered RSVPs",
    gradient: "from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]",
    badgeBg: "bg-purple-100",
    badgeColor: "text-purple-800 border-purple-200",
    iconBg: "bg-[#7E22CE]",
    accentColor: "#7E22CE",
    statusText: "99.1% Verified",
    statusType: "purple",
  },
];

export default function HeroArchCarousel() {
  const [activeIndex, setActiveIndex] = useState(2); // Center on Finedge initially
  const [isPaused, setIsPaused] = useState(false);
  const total = HERO_CARDS.length;

  // Auto-advance through the arch carousel
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <div 
      className="relative w-full max-w-6xl mx-auto pt-2 pb-6 px-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Arched Panoramic Carousel Deck */}
      <div className="relative h-[220px] sm:h-[260px] flex items-center justify-center overflow-visible">
        {HERO_CARDS.map((card, index) => {
          // Calculate relative offset from active card
          let offset = index - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          // Render only cards within visibility range (-2 to +2)
          if (Math.abs(offset) > 2) return null;

          // Compute geometric 3D arch positioning
          const isCenter = offset === 0;
          const xOffset = offset * 210; // Horizontal spread in px
          const yOffset = Math.abs(offset) * 18; // Arched dip on edges
          const rotateZ = offset * 5; // Tilted angle matching FifthLab reference
          const scale = isCenter ? 1.06 : 0.9 - Math.abs(offset) * 0.05;
          const zIndex = 30 - Math.abs(offset) * 10;
          const opacity = isCenter ? 1 : 0.85 - Math.abs(offset) * 0.2;

          return (
            <motion.div
              key={card.id}
              onClick={() => setActiveIndex(index)}
              animate={{
                x: xOffset,
                y: yOffset,
                rotateZ: rotateZ,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 24,
                mass: 0.8,
              }}
              className={cn(
                "absolute w-[200px] sm:w-[225px] h-[175px] sm:h-[195px] rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-shadow",
                "bg-gradient-to-b border backdrop-blur-xl shadow-lg hover:shadow-2xl",
                card.gradient,
                isCenter
                  ? "border-[#20B2AA]/50 shadow-[0_16px_36px_-6px_rgba(0,144,173,0.22)] ring-2 ring-[#20B2AA]/30"
                  : "border-white/80 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)] hover:opacity-100"
              )}
            >
              {/* Card Header: Product Icon & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs shadow-xs", card.iconBg)}>
                    {card.product.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-gray-900 block leading-tight truncate max-w-[90px]">
                      {card.product}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {card.city}
                    </span>
                  </div>
                </div>

                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0", card.badgeBg, card.badgeColor)}>
                  {card.date}
                </span>
              </div>

              {/* Card Center: Big Metrics / Activity */}
              <div className="text-left space-y-0.5 py-1">
                <div className="text-xl sm:text-2xl font-extrabold text-gray-950 tracking-tight font-mono">
                  {card.statNumber}
                </div>
                <div className="text-[10px] font-medium text-gray-600 truncate">
                  {card.statLabel}
                </div>
              </div>

              {/* Card Footer: Live Feature Status */}
              <div className="pt-2 border-t border-black/[0.06] flex items-center justify-between text-[10px]">
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider truncate">
                  {card.category}
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-[#00829B] text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20B2AA] animate-pulse" />
                  {card.statusText}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 2. Carousel Controls & Pagination Dots */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-950 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {HERO_CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all cursor-pointer",
                i === activeIndex
                  ? "w-6 bg-[#0090AD]"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-gray-950 hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
