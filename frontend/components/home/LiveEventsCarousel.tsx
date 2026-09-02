"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Ticket, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LiveEventsCarouselProps {
  events: Event[];
  onClaimPass: (tier: "FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER", eventId?: string) => void;
}

const FALLBACK_IMAGES = [
  "/images/keynote_lagos.jpg",
  "/images/exhibition_hall.jpg",
  "/images/vip_lounge.jpg",
  "/images/qr_registration.jpg",
];

export default function LiveEventsCarousel({ events, onClaimPass }: LiveEventsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [events]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const cardWidth = 360;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Header with Navigation Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F8FA] border border-[#20B2AA]/30 text-[#00829B] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#20B2AA] animate-pulse" />
            LIVE SUMMIT SCHEDULE • WAT (UTC+1)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Featured Summits & Keynote Conferences
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Real-time events index updated directly from the operations console. Claim digital attendee passes or schedule 1-on-1 executive demos.
          </p>
        </div>

        {/* Scroll Control Arrows */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
            aria-label="Previous events"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
            aria-label="Next events"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {events.map((evt, idx) => {
          const imgSource = evt.imageUrl && evt.imageUrl.startsWith("/images/") 
            ? evt.imageUrl 
            : FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

          return (
            <div
              key={evt.id}
              className="w-[300px] sm:w-[350px] shrink-0 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group text-left"
            >
              {/* Event Image Cover */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={imgSource}
                  alt={evt.title}
                  fill
                  sizes="(max-width: 768px) 300px, 350px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category & Status Overlay */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold tracking-wider uppercase border border-white/20 shadow-xs">
                    {evt.category}
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-mono font-bold shadow-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    WAT LIVE
                  </span>
                </div>

                {/* Bottom Image Gradient Fade */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex items-end p-3.5">
                  <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#20B2AA]" />
                    <span>{evt.location}, {evt.city}</span>
                  </div>
                </div>
              </div>

              {/* Event Details Body */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#0090AD]" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0090AD] transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                {/* Stats & Attendance */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-bold font-mono">
                    <Users className="w-3.5 h-3.5 text-[#0090AD]" />
                    <span>{evt.expectedAttendance || 1200}+ RSVPs</span>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Passes Open
                  </span>
                </div>

                {/* Claim Pass CTA Button */}
                <div className="pt-1">
                  <button
                    onClick={() => onClaimPass("FREE_VISITOR", evt.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Claim Digital Pass</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
