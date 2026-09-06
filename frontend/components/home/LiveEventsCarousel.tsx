"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpRight,
  Clock,
  ExternalLink
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
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [expandedMobileIndex, setExpandedMobileIndex] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Resolve best image URL for an event
  const resolveImage = useCallback((evt: EventItem, idx: number) => {
    if (imageErrors[evt.id]) {
      return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
    }
    if (evt.imageUrl && evt.imageUrl.trim().length > 0) {
      return evt.imageUrl.trim();
    }
    return FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
  }, [imageErrors]);

  // Recalculate which card is active/spotlit in the scroll container
  const updateActiveCard = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;

    let closestIdx = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
    setCanScrollLeft(container.scrollLeft > 20);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 20);
  }, []);

  // Handle scroll events with requestAnimationFrame for smooth 60fps performance
  const handleScroll = useCallback(() => {
    requestAnimationFrame(updateActiveCard);

    // Pause autoplay while user actively scrolls/swipes
    setIsUserInteracting(true);
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    interactionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 3000);
  }, [updateActiveCard]);

  // Scroll smoothly to a specific card index WITHOUT affecting window/page scroll
  const scrollToCard = useCallback((index: number) => {
    if (index < 0 || index >= events.length) return;
    const targetCard = cardRefs.current[index];
    const container = scrollContainerRef.current;
    if (targetCard && container) {
      if (index === 0) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardRect = targetCard.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const targetScrollLeft = container.scrollLeft + (cardRect.left - containerRect.left) - (container.clientWidth - targetCard.clientWidth) / 2;
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: "smooth",
        });
      }
      setActiveIndex(index);
    }
  }, [events.length]);

  const scrollPrev = () => {
    const nextIdx = activeIndex === 0 ? events.length - 1 : activeIndex - 1;
    scrollToCard(nextIdx);
  };

  const scrollNext = () => {
    const nextIdx = (activeIndex + 1) % events.length;
    scrollToCard(nextIdx);
  };

  // Auto-playing loop - runs purely horizontally on its own without affecting window scroll
  useEffect(() => {
    if (events.length <= 1 || isCarouselHovered || isUserInteracting || hoveredIndex !== null) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % events.length;
        const targetCard = cardRefs.current[nextIndex];
        const container = scrollContainerRef.current;
        if (targetCard && container) {
          if (nextIndex === 0) {
            container.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            const cardRect = targetCard.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const targetScrollLeft = container.scrollLeft + (cardRect.left - containerRect.left) - (container.clientWidth - targetCard.clientWidth) / 2;
            container.scrollTo({
              left: Math.max(0, targetScrollLeft),
              behavior: "smooth",
            });
          }
        }
        return nextIndex;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [events.length, isCarouselHovered, isUserInteracting, hoveredIndex]);

  // On mount and resize, initialize active card and scroll tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      updateActiveCard();
    }, 150);

    window.addEventListener("resize", updateActiveCard);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateActiveCard);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [updateActiveCard, events.length]);

  if (!events || events.length === 0) return null;

  return (
    <div 
      className="relative w-full py-6 font-sans overflow-hidden"
      onMouseEnter={() => setIsCarouselHovered(true)}
      onMouseLeave={() => setIsCarouselHovered(false)}
    >
      {/* Header with Title and Control Arrows */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 w-full px-6 sm:px-20 md:px-28 lg:px-36 xl:px-44 max-w-7xl mx-auto">
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
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={scrollPrev}
            className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Previous event"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={scrollNext}
            className="p-2.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs transition-all cursor-pointer hover:scale-105 active:scale-95"
            aria-label="Next event"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track - Centered on mobile, generous left start padding on desktop */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onTouchStart={() => setIsUserInteracting(true)}
        onTouchEnd={() => {
          if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
          }
          interactionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
          }, 3000);
        }}
        className="flex items-center gap-5 sm:gap-7 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-10 sm:py-14 w-full touch-pan-x"
      >
        {/* Physical Spacer before first card: centers card on mobile, gives 80px-176px breathing room on desktop */}
        <div 
          className="shrink-0 w-[calc(50vw-142px)] sm:w-20 md:w-28 lg:w-36 xl:w-44 pointer-events-none" 
          aria-hidden="true" 
        />

        {events.map((evt, idx) => {
          const isSpotlit = activeIndex === idx;
          const isHovered = hoveredIndex === idx;
          const isExpanded = isHovered || expandedMobileIndex === idx;
          const imgSrc = resolveImage(evt, idx);

          return (
            <div
              key={evt.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              onClick={() => {
                if (!isSpotlit) {
                  scrollToCard(idx);
                } else {
                  // Toggle expanded on mobile tap
                  setExpandedMobileIndex((prev) => (prev === idx ? null : idx));
                }
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`group relative snap-center shrink-0 w-[285px] sm:w-[340px] md:w-[370px] h-[450px] sm:h-[490px] rounded-[32px] overflow-hidden cursor-pointer select-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform-gpu text-left ${
                isSpotlit || isHovered
                  ? "scale-100 opacity-100 blur-0 shadow-2xl z-20 ring-1 ring-black/10"
                  : "scale-[0.96] opacity-50 sm:opacity-60 blur-[2px] sm:blur-[3px] shadow-md z-10 hover:opacity-100 hover:scale-100 hover:blur-0"
              }`}
            >
              {/* Full Image Background - Responsive to Dashboard Upload */}
              <div className="absolute inset-0 w-full h-full bg-slate-900">
                <Image
                  src={imgSrc}
                  alt={evt.title}
                  fill
                  sizes="(max-width: 640px) 290px, (max-width: 1024px) 340px, 370px"
                  unoptimized={imgSrc.startsWith("data:") || imgSrc.startsWith("http")}
                  onError={() => {
                    setImageErrors((prev) => ({ ...prev, [evt.id]: true }));
                  }}
                  className={`object-cover w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isExpanded ? "scale-105" : "scale-100"
                  }`}
                  priority={idx < 3}
                />
              </div>

              {/* Soft Blurring Translucent Mask for Non-Spotlit Cards */}
              {!isSpotlit && !isHovered && (
                <div className="absolute inset-0 bg-white/10 sm:bg-white/10 backdrop-blur-[1px] transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Gradient Scrim for Readability */}
              <div 
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  isExpanded
                    ? "bg-gradient-to-t from-black/95 via-black/75 to-black/30"
                    : "bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                }`} 
              />

              {/* Bottom Details Container */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col justify-end text-white z-10 space-y-2.5">
                
                {/* Category & Date - ALWAYS VISIBLE */}
                <div className="text-[11px] sm:text-xs font-mono font-medium text-white/80 tracking-wide flex items-center gap-1.5 drop-shadow-xs">
                  <span>{evt.category || "Event"}</span>
                  <span>•</span>
                  <span>{evt.date}</span>
                </div>

                {/* Event Title - ALWAYS VISIBLE */}
                <h3 className="text-lg sm:text-xl md:text-[22px] font-bold text-white tracking-tight leading-snug drop-shadow-md line-clamp-2">
                  {evt.title}
                </h3>

                {/* Extended Details - Revealed on Hover / Mobile Tap */}
                <div 
                  className={`overflow-hidden transition-all duration-400 ease-in-out ${
                    isExpanded 
                      ? "max-h-60 opacity-100 pt-1.5 space-y-3" 
                      : "max-h-0 opacity-0 space-y-0"
                  }`}
                >
                  {/* Event Schedule & Venue */}
                  <div className="space-y-1 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#20B2AA] shrink-0" />
                      <span className="truncate">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#20B2AA] shrink-0" />
                      <span className="truncate">{evt.location}, {evt.city}</span>
                    </div>
                  </div>

                  {/* Event Description */}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onClaimPass("FREE_VISITOR", evt.id);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5 text-[#0090AD]" />
                      <span>Claim Digital Pass</span>
                    </button>

                    <Link
                      href={`/events/${evt.id}`}
                      onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all cursor-pointer"
                      title="View Event Details"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Subtle Prompt when not hovered */}
                {!isExpanded && (
                  <div className="pt-1 flex items-center justify-between text-[11px] text-white/70 font-mono">
                    <span className="truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#20B2AA]" />
                      {evt.city}
                    </span>
                    <span className="text-white/90 underline underline-offset-2">
                      Hover for details
                    </span>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Physical Spacer after last card: centers card on mobile, gives breathing room on desktop */}
        <div 
          className="shrink-0 w-[calc(50vw-142px)] sm:w-20 md:w-28 lg:w-36 xl:w-44 pointer-events-none" 
          aria-hidden="true" 
        />
      </div>

      {/* Bottom Center Pill CTA - Matching Reference Image Style */}
      <div className="flex justify-center mt-6 px-4">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>View all Summits & Events</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
