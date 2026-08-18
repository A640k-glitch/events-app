"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight, Sparkles, Ticket } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import RegisterPassModal from "@/components/modals/RegisterPassModal";

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
  const { events, user } = useApp();

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

  // Keep index in bounds if events array changes
  useEffect(() => {
    if (currentIndex >= displayEvents.length) {
      setCurrentIndex(0);
    }
  }, [displayEvents.length, currentIndex]);

  // Automated Carousel Timer (4.5s per slide)
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

  const currentEvt = displayEvents[currentIndex] || placeholderSlide;

  const handleClaimPass = (evt: EventSlide) => {
    setSelectedEventForPass({ id: evt.id, title: evt.title });
    setIsRegisterOpen(true);
  };

  return (
    <section className="py-16 bg-[#07080c] border-y border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <p className="text-xs text-cyan-400 uppercase tracking-widest font-medium">
              FIFTHLAB ENTERPRISE EVENTS
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight font-heading">
              Featured Tech Conferences & Summits
            </h2>
            <p className="text-sm text-white/60 max-w-xl font-light">
              Explore live upcoming conferences, summits, and executive briefings hosted by The FifthLab Nigeria.
            </p>
          </div>

          {/* Controls */}
          {displayEvents.length > 1 && (
            <div className="flex items-center gap-3 shrink-0 text-xs font-light">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                aria-label="Previous Event"
              >
                <ChevronLeft className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                aria-label="Next Event"
              >
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          )}
        </div>

        {/* Auto-Play Stage Container with Hover Pause */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
        >
          {/* Top Timer Progress Bar */}
          {!isPaused && displayEvents.length > 1 && (
            <motion.div
              key={currentIndex}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-0.5 bg-cyan-500 origin-left w-full absolute top-0 left-0 z-30"
            />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvt.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[400px]"
            >
              {/* Left Image Spotlight */}
              <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full overflow-hidden">
                <img
                  src={currentEvt.bgImage}
                  alt={currentEvt.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black" />
                
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    {currentEvt.category}
                  </span>
                </div>
              </div>

              {/* Right Details Container */}
              <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-cyan-400 font-light">
                    <Calendar className="w-4 h-4" />
                    <span>{currentEvt.date}</span>
                    <span className="text-white/40">•</span>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-white font-medium">{currentEvt.city}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-normal text-white leading-tight font-heading">
                    {currentEvt.title}
                  </h3>

                  <p className="text-sm text-white/70 leading-relaxed font-light">
                    {currentEvt.description}
                  </p>

                  <div className="pt-2 text-xs text-white/60 flex items-center gap-2 font-light">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Venue: {currentEvt.location}</span>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-light">
                  <div className="flex items-center gap-2.5">
                    {currentEvt.confirmedStaff > 0 ? (
                      <span className="text-white font-medium">
                        {currentEvt.confirmedStaff} Confirmed Staff Manifest
                      </span>
                    ) : (
                      <span className="text-white/50 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Live Database Synchronization Active</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleClaimPass(currentEvt)}
                      className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Get Event Pass</span>
                    </button>

                    {user && (
                      <Link
                        href="/dashboard/events"
                        className="px-4 py-2.5 border border-white/20 hover:border-white/40 text-white font-medium transition-all"
                      >
                        Manage Manifest
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicator Square Bar */}
        {displayEvents.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {displayEvents.map((evt, idx) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "h-1 transition-all cursor-pointer",
                  currentIndex === idx
                    ? "w-8 bg-cyan-400"
                    : "w-2 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Public Visitor Registration Modal */}
      <RegisterPassModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        selectedEventId={selectedEventForPass?.id}
        selectedEventTitle={selectedEventForPass?.title}
      />
    </section>
  );
}
