"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { EventItem } from "@/lib/types";

interface LiveEventsCarouselProps {
  events: EventItem[];
  onClaimPass: (passType: "FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER", eventId?: string) => void;
}

const FALLBACK_IMAGES = [
  "/images/auth/real_lagos_keynote.jpg",
  "/images/auth/real_lagos_checkin.jpg",
  "/images/auth/developer.jpg",
  "/images/vip_lounge.jpg",
];

export default function LiveEventsCarousel({ events, onClaimPass }: LiveEventsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [, setIsHovered] = useState(false);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
      setTimeout(checkScrollability, 350);
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <div className="relative w-full py-6 font-sans overflow-hidden">
      
      {/* Header with Navigation Arrows - Full Width with edge padding */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 px-4 sm:px-8 lg:px-12 w-full">
        <div className="space-y-1.5 text-left">
          <div className="text-xs font-mono font-bold text-[#0090AD] uppercase tracking-wider">
            Live Summit Schedule
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Featured Summits & Keynote Conferences
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Real-time events index updated directly from the dashboard. Claim digital attendee passes or schedule 1-on-1 executive demos.
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

      {/* Horizontal Carousel Track - Full Width Edge-to-Edge */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-4 sm:px-8 lg:px-12 w-full"
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

                  <h3 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#0090AD] transition-colors">
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

                  <span className="text-xs font-semibold text-emerald-600">
                    Passes Open
                  </span>
                </div>

                {/* Claim Pass CTA Button */}
                <div className="pt-1">
                  <button
                    onClick={() => onClaimPass("FREE_VISITOR", evt.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
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
