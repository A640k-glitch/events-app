"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight, Play, Pause } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

export default function EventsCarousel() {
  const events: EventSlide[] = [
    {
      id: "evt-1",
      title: "Texcellence 2026 Technology Conference",
      category: "FLAGSHIP SUMMIT",
      date: "AUG 14, 2026",
      location: "Landmark Centre, Victoria Island",
      city: "Lagos, Nigeria",
      description: "West Africa's premier technology and digital transformation conference hosted by CWG PLC & Texcellence.",
      bgImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
      confirmedStaff: 6,
    },
    {
      id: "evt-2",
      title: "FifthLab Fintech & Payments Africa Summit",
      category: "EXPOSITION",
      date: "AUG 28, 2026",
      location: "Eko Hotels & Suites, Victoria Island",
      city: "Lagos, Nigeria",
      description: "High-throughput NGN payments switching, BVN identity proofing, and core banking infrastructure showcase.",
      bgImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
      confirmedStaff: 4,
    },
    {
      id: "evt-3",
      title: "CWG PLC Enterprise Cloud & Power Forum",
      category: "EXECUTIVE BRIEFING",
      date: "SEP 05, 2026",
      location: "Transcorp Hilton",
      city: "Abuja, Nigeria",
      description: "Exclusive corporate gathering focusing on industrial energy metering, grid telemetry, and enterprise cloud OS.",
      bgImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop",
      confirmedStaff: 3,
    },
    {
      id: "evt-4",
      title: "Texcellence Digital Transformation Expo",
      category: "EXPOSITION",
      date: "SEP 18, 2026",
      location: "Zone Tech Park, Gbagada",
      city: "Lagos, Nigeria",
      description: "Exposition uniting 12,000+ technology leaders, government policy makers, and enterprise system architects.",
      bgImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop",
      confirmedStaff: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automated Carousel Timer (4.5 Seconds per slide)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, events.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const currentEvt = events[currentIndex];

  return (
    <section className="py-16 bg-[#07080c] border-y border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header (No Pill / Badge Box Wrapper) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-left">
            <p className="text-xs text-blue-400 uppercase tracking-widest font-medium">
              CWG PLC • FIFTHLAB • TEXCELLENCE MANIFEST
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal text-white tracking-tight font-heading">
              Featured Tech Conferences & Summits
            </h2>
            <p className="text-sm text-white/60 max-w-xl font-light">
              Discover upcoming conferences, summits, and executive briefings hosted by CWG PLC, Texcellence, and FifthLab Nigeria.
            </p>
          </div>

          {/* Controls & Auto-Play Status */}
          <div className="flex items-center gap-3 shrink-0 text-xs font-light">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-blue-400" />}
              <span>{isPaused ? "Resume Auto-Play" : "Autoplay Active"}</span>
            </button>

            <button
              onClick={prevSlide}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
              aria-label="Previous Event"
            >
              <ChevronLeft className="w-4 h-4 text-blue-400" />
            </button>

            <button
              onClick={nextSlide}
              className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
              aria-label="Next Event"
            >
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </button>
          </div>
        </div>

        {/* Auto-Play Stage Container with Hover Pause */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative overflow-hidden border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl"
        >
          {/* Top Timer Progress Bar */}
          {!isPaused && (
            <motion.div
              key={currentIndex}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-0.5 bg-blue-600 origin-left w-full absolute top-0 left-0 z-30"
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
              {/* Left Image Spotlight (5 cols) */}
              <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full overflow-hidden">
                <img
                  src={currentEvt.bgImage}
                  alt={currentEvt.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black" />
                
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {currentEvt.category}
                  </span>
                </div>
              </div>

              {/* Right Details Container (7 cols) */}
              <div className="lg:col-span-7 p-6 lg:p-10 flex flex-col justify-between space-y-6 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-blue-400 font-light">
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
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>Venue: {currentEvt.location}</span>
                  </div>
                </div>

                {/* Attendance Manifest Footer */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-light">
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-1.5">
                      <img className="w-7 h-7 border border-black object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt="Staff" />
                      <img className="w-7 h-7 border border-black object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" alt="Staff" />
                      <img className="w-7 h-7 border border-black object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" alt="Staff" />
                    </div>
                    <span className="text-white">{currentEvt.confirmedStaff} Confirmed Staff Manifest</span>
                  </div>

                  <Link
                    href="/dashboard/events"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
                  >
                    <span>View Event Manifest</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicator Square Bar */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {events.map((evt, idx) => (
            <button
              key={evt.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1 transition-all cursor-pointer",
                currentIndex === idx
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
