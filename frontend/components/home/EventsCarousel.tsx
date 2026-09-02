"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import RegisterPassModal from "@/components/modals/RegisterPassModal";
import { BrandButton } from "@/components/ui/BrandButtons";

interface EventSlide {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  city: string;
  description: string;
  bgImage: string;
  confirmedStaff: number;
}

const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop";

export default function EventsCarousel() {
  const { events } = useApp();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedEventForPass, setSelectedEventForPass] = useState<{ id: string; title: string } | null>(null);

  // Convert live database events to carousel slides
  const liveSlides: EventSlide[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category.toUpperCase(),
    date: e.date,
    location: e.location,
    city: `${e.city}, ${e.country}`,
    description: e.description,
    bgImage: (e as any).imageUrl || DEFAULT_EVENT_IMAGE,
    confirmedStaff: e.confirmedStaffCount || e.attendanceManifest.length || 0,
  }));

  // Fallback placeholder card when no events are published yet
  const placeholderSlide: EventSlide = {
    id: "coming-soon-placeholder",
    title: "Upcoming FifthLab Technology Events",
    category: "COMING SOON",
    date: "2026 Schedule",
    location: "Lagos • Abuja • West Africa",
    city: "Nigeria",
    description: "New enterprise briefings, fintech summits, and product showcases will be published here dynamically. Check back soon for the updated schedule.",
    bgImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    confirmedStaff: 0,
  };

  const displayEvents: EventSlide[] = liveSlides.length > 0 ? liveSlides : [placeholderSlide];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIndex = currentIndex < displayEvents.length ? currentIndex : 0;

  useEffect(() => {
    if (isPaused || displayEvents.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayEvents.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, displayEvents.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayEvents.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayEvents.length) % displayEvents.length);
  };

  const currentEvt = displayEvents[safeIndex] || placeholderSlide;

  const handleClaimPass = (evt: EventSlide) => {
    setSelectedEventForPass({ id: evt.id, title: evt.title });
    setIsRegisterOpen(true);
  };

  return (
    <section className="py-16 bg-[#FAFAFB] border-y border-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <p className="text-xs text-[#0090AD] uppercase tracking-widest font-semibold">
              FIFTHLAB ENTERPRISE EVENTS
            </p>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#0E0E0E] tracking-tight">
              Featured Tech Conferences & Summits
            </h2>
            <p className="text-sm text-[#5F5F7A] max-w-xl">
              Explore live upcoming conferences, summits, and executive briefings hosted by The FifthLab Nigeria.
            </p>
          </div>

          {/* Controls */}
          {displayEvents.length > 1 && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-[#0E0E0E] transition-all cursor-pointer shadow-xs"
                aria-label="Previous Event"
              >
                <ChevronLeft className="w-4 h-4 text-[#0090AD]" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-[#0E0E0E] transition-all cursor-pointer shadow-xs"
                aria-label="Next Event"
              >
                <ChevronRight className="w-4 h-4 text-[#0090AD]" />
              </button>
            </div>
          )}
        </div>

        {/* Auto-Play Stage Container with Hover Pause */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg"
        >
          {/* Top Timer Progress Bar */}
          {!isPaused && displayEvents.length > 1 && (
            <motion.div
              key={safeIndex}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-1 bg-[#00B4D8] origin-left w-full absolute top-0 left-0 z-30"
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            {/* Image Stage */}
            <div className="lg:col-span-5 relative h-60 lg:h-auto overflow-hidden bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvt.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentEvt.bgImage}
                    alt={currentEvt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-semibold rounded-full border border-white/20">
                  {currentEvt.category}
                </span>
              </div>
            </div>

            {/* Content Stage */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 text-left">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs text-[#5F5F7A]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0090AD]" />
                    {currentEvt.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0090AD]" />
                    {currentEvt.city}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-medium text-[#0E0E0E] leading-snug">
                  {currentEvt.title}
                </h3>

                <p className="text-sm text-[#5F5F7A] leading-relaxed line-clamp-3">
                  {currentEvt.description}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-[#5F5F7A]">
                    {currentEvt.confirmedStaff} Staff Attending • WAT Sync
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/events/${currentEvt.id}`}>
                    <BrandButton variant="secondaryDark" size="sm">
                      View Details
                    </BrandButton>
                  </Link>

                  <BrandButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleClaimPass(currentEvt)}
                  >
                    Claim Pass
                  </BrandButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RegisterPassModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialEventId={selectedEventForPass?.id}
      />
    </section>
  );
}
