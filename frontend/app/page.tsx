"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  ChevronDown,
  ShieldCheck,
  QrCode,
  Users,
  Laptop,
  Calendar
} from "lucide-react";
import CwgLogo from "@/components/brand/CwgLogo";
import FifthEventsWordmark from "@/components/brand/FifthEventsWordmark";
import { useApp } from "@/context/AppContext";
import RegisterPassModal from "@/components/modals/RegisterPassModal";
import PitchProposalModal from "@/components/modals/PitchProposalModal";
import { cn } from "@/lib/utils";
import HeroSpotlightCarousel from "@/components/home/HeroSpotlightCarousel";
import LiveEventsCarousel from "@/components/home/LiveEventsCarousel";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import IPhoneMockup from "@/components/home/IPhoneMockup";

export default function Home() {
  const { events } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Scroll reveal trigger for About section cards and buttons
  const aboutRef = useRef<HTMLElement>(null);
  const [aboutInView, setAboutInView] = useState(false);

  // Reference for FAQ section to auto-close accordions when scrolled away
  const faqSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAboutInView(true);
          }
        });
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-close open FAQ when user scrolls away from the FAQ section
  useEffect(() => {
    const el = faqSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setOpenFaq(null);
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Modals state
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passModalTier, setPassModalTier] = useState<"FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER">("FREE_VISITOR");
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  const faqs = [
    {
      q: "How does the West Africa Time (WAT) normalization work?",
      a: "Every schedule is shown in West Africa Time (WAT, UTC+1). Whether you are in Lagos, Abuja, Accra, or Nairobi, session times remain clear without timezone confusion.",
    },
    {
      q: "How do I book a product demo with FifthLab or CWG?",
      a: "You can book a demo directly through any event page or the demo booking portal. Select the solution you want to explore, such as Bulkwave, FinEdge, or SMERP, and pick a preferred date and time.",
    },
    {
      q: "How do digital event passes work?",
      a: "Once you claim a pass, your digital ticket is ready with a unique QR code. Present it at the door on your phone for quick check-in.",
    },
    {
      q: "Is attendee registration data kept private?",
      a: "Yes. All registrations and contact details are encrypted and stored in full compliance with enterprise data protection and privacy standards.",
    },
  ];

  const handleOpenPassModal = (tier: "FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER", eventId?: string) => {
    setPassModalTier(tier);
    setSelectedEventId(eventId);
    setIsPassModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#111827] flex flex-col justify-between selection:bg-[#00B4D8] selection:text-white font-sans">
      
      {/* 1. Hero Section — Two-column: Phone mockup left, text right */}
      <section className="relative pt-20 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">

        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 pb-14">

            {/* Hero Copy (Top on Mobile, Right on Desktop) */}
            <div className="flex-1 flex flex-col gap-6 text-center lg:text-left order-1 lg:order-2">
              <h1
                className="font-bold tracking-tight text-slate-950"
                style={{ fontSize: "clamp(34px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.14 }}
              >
                The central hub for{" "}
                <span className="text-[#00829B]">events shaping</span>{" "}
                technology.
              </h1>

              <p className="text-sm sm:text-base text-slate-800 font-normal max-w-xl leading-relaxed mx-auto lg:mx-0">
                Track tech summits across Africa, get entry passes in seconds, and book live product demos from <span className="tracking-tight text-slate-950 font-semibold"><strong className="font-bold">fifth</strong><span className="font-normal">lab</span></span> and <strong className="text-slate-950 font-bold">CWG</strong>.
              </p>

              <motion.div 
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center lg:items-start justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto"
              >
                <Link
                  href="/events"
                  className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap overflow-hidden"
                >
                  <span className="relative z-10">Explore Events</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                </Link>

                <Link
                  href="/demo"
                  className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Book a Demo</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-slate-400 group-hover:text-slate-200" />
                </Link>
              </motion.div>
            </div>

            {/* iPhone 16 Mockup:
                - Mobile (< 640px): Visible, order-2 (flows vertically directly under CTAs), centered
                - Tablets (640px-1023px, sm & md): Hidden (avoids cramming on tablets)
                - Desktop (>= 1024px, lg): Visible, order-1 (sits on the left)
            */}
            <div className="flex-shrink-0 order-2 lg:order-1 flex sm:hidden lg:flex justify-center w-full lg:w-auto">
              <IPhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* 1.5. Hero Spotlight & Partner Logos Section — Option 2: Executive Obsidian & Cyan Aurora */}
      <section 
        className="relative w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden z-10"
        style={{
          backgroundColor: "#05080E",
          backgroundImage: "linear-gradient(145deg, #04060B 0%, #070D18 45%, #05080E 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Luminous Top & Bottom Accent Rules */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0090AD]/40 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0090AD]/25 to-transparent pointer-events-none" />

        {/* Micro-Texture: Subtle Cyber Dot-Matrix Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Ambient Auroral Glows (CWG Navy + FifthLab Electric Cyan) */}
        <div 
          className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(21, 15, 69, 0.45) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute -bottom-28 right-0 w-[600px] h-[500px] rounded-full pointer-events-none blur-[130px]"
          style={{ background: "radial-gradient(circle, rgba(0, 144, 173, 0.18) 0%, rgba(32, 178, 170, 0.08) 50%, transparent 70%)" }}
        />

        {/* Faint Big Fingerprint Ridges to the Left of the Section */}
        <FingerprintPattern 
          size={780} 
          opacity={0.16} 
          strokeWidth={1.3}
          className="absolute -left-32 -top-20 text-[#0090AD] -rotate-12 pointer-events-none select-none" 
        />

        {/* Dynamic Spotlight Carousel & Partner Orbit Stage */}
        <div className="max-w-7xl mx-auto relative z-10">
          <HeroSpotlightCarousel />
        </div>
      </section>

      {/* 2. Customer-Facing Dynamic Live Events Carousel */}
      <section className="py-12 bg-slate-50/40 backdrop-blur-2xs border-t border-slate-200/60 relative z-10 w-full overflow-hidden">
        <LiveEventsCarousel 
          events={events} 
          onClaimPass={handleOpenPassModal} 
        />
      </section>

      {/* 3. Core Capabilities Row with Deep Biometric Dark Background & Dense Fingerprint Patterns */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white z-10"
        style={{
          backgroundColor: "#06090e",
          background: "linear-gradient(180deg, #090e17 0%, #06090e 50%, #030508 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        
        {/* Multiple Dense Fingerprint Patterns Across Background */}
        <FingerprintPattern 
          size={640} 
          opacity={0.38} 
          className="absolute -left-20 -top-28 text-[#26B5BA] -rotate-12 pointer-events-none" 
        />
        <FingerprintPattern 
          size={480} 
          opacity={0.18} 
          className="absolute -left-24 -bottom-24 text-white rotate-45 pointer-events-none" 
        />
        <FingerprintPattern 
          size={700} 
          opacity={0.38} 
          className="absolute -right-20 -top-32 text-[#26B5BA] rotate-12 pointer-events-none" 
        />
        <FingerprintPattern 
          size={540} 
          opacity={0.25} 
          className="absolute -right-24 -bottom-28 text-[#30B5C1] -rotate-12 pointer-events-none" 
        />
        <FingerprintPattern 
          size={420} 
          opacity={0.12} 
          className="absolute left-1/2 -top-20 -translate-x-1/2 text-white rotate-6 pointer-events-none" 
        />

        {/* Ambient Subtle Cyan/Teal Glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[320px] bg-[#26B5BA]/12 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#30B5C1]">
              BUILT FOR THE <span className="font-bold">FIFTH</span><span className="font-light">LAB</span> ECOSYSTEM
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              Everything needed to run an event without the chaos.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Keynote Discovery */}
            <div 
              className="frosted-capability-card p-7 text-left flex flex-col justify-between space-y-6 group"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="space-y-4">
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <Image
                    src="/images/auth/speaker_lineup.jpg"
                    alt="Schedules & Speaker Lineups"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-[#30B5C1] transition-colors">
                  Schedules & Speaker Lineups
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Keynote schedules and session times normalized to West Africa Time (WAT). No timezone math, no missed talks.
                </p>
              </div>

              <div>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#30B5C1] hover:text-[#52D1DC] hover:underline"
                >
                  <span>Explore schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Interactive Product Demos */}
            <div 
              className="frosted-capability-card p-7 text-left flex flex-col justify-between space-y-6 group"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="space-y-4">
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <Image
                    src="/images/auth/live_product_demo.jpg"
                    alt="Live Product Demos"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-[#30B5C1] transition-colors">
                  Live Product Demos
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Book 1-on-1 walkthroughs with product teams behind Bulkwave, Finedge, and SMERP right at the venue.
                </p>
              </div>

              <div>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#30B5C1] hover:text-[#52D1DC] hover:underline"
                >
                  <span>Book a demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Door Check-In Scanner */}
            <div 
              className="frosted-capability-card p-7 text-left flex flex-col justify-between space-y-6 group"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div className="space-y-4">
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <Image
                    src="/images/auth/digital_pass_scan.jpg"
                    alt="Digital Entry Passes"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-[#30B5C1] transition-colors">
                  Digital Entry Passes
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Scan your digital pass at the door in under a second for fast, hassle-free entry into the venue.
                </p>
              </div>

              <div>
                <button
                  onClick={() => handleOpenPassModal("FREE_VISITOR")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#30B5C1] hover:text-[#52D1DC] hover:underline cursor-pointer"
                >
                  <span>Claim digital pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. About Section — The Infrastructure & People Behind Africa's Flagship Summits */}
      <section 
        id="about" 
        ref={aboutRef}
        className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden z-10 border-t border-slate-200/70 scroll-mt-24"
      >
        {/* Ambient Subtle Biometric Pattern Deco */}
        <FingerprintPattern
          size={560}
          opacity={0.035}
          className="absolute -right-28 -top-24 text-[#0090AD] rotate-12 pointer-events-none"
        />
        <FingerprintPattern
          size={500}
          opacity={0.025}
          className="absolute -left-28 -bottom-24 text-slate-900 -rotate-12 pointer-events-none"
        />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Head on its own line */}
          <div 
            className={cn(
              "text-left mb-6 sm:mb-8 transition-all duration-700 ease-out",
              aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase text-[#0090AD] leading-tight m-0">
              ABOUT <span className="text-slate-950 font-black">FIFTH</span><span className="font-light text-slate-900">EVENTS</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column: Photo Card */}
            <div className="lg:col-span-5 relative">
              <div 
                className={cn(
                  "relative mx-auto max-w-md lg:max-w-none transition-all duration-700 ease-out",
                  aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: "150ms" }}
              >
                {/* Ambient glow ring behind card */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#0090AD]/20 via-[#26B5BA]/15 to-[#162054]/10 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

                {/* Main Photo Card without pills */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 group">
                  <div className="aspect-[4/5] relative w-full">
                    <Image
                      src="/images/about/event-staff-vip.jpg"
                      alt="FifthEvents VIP Event Coordinator"
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative & Value Pillars */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div 
                className={cn(
                  "space-y-3 transition-all duration-700 ease-out",
                  aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                )}
              >
                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
                  Built for the events that actually matter in African tech.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                  <span className="tracking-tight text-slate-900"><strong className="font-bold">fifth</strong><span className="font-light">lab</span></span> and <strong>CWG PLC</strong> run fintech conferences, banking expos, and developer summits across Nigeria and West Africa. We built <FifthEventsWordmark theme="light" className="text-sm sm:text-base" /> so attendees can easily discover upcoming conferences, get tickets, and explore live solutions on site.
                </p>
              </div>

              {/* 3 Value Pillars with thefifthlab.com Signature Pastel Card Palette — Staggered Entry Animation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* Card 1: Digital Event Passes */}
                <div 
                  className={cn(
                    "relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-[#EAF7F7] border border-[#CEEFEF] shadow-[0_2px_12px_rgba(0,0,0,0.02)]",
                    "hover:border-[#0090AD]/50 hover:shadow-[0_16px_36px_-8px_rgba(0,144,173,0.2)] hover:-translate-y-1.5",
                    "group flex flex-col justify-between min-h-[152px] transition-all duration-700 ease-out",
                    aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ transitionDelay: "150ms" }}
                >
                  <div className="relative z-10 space-y-2 pr-6">
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight">Digital Event Passes</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Save passes to your phone for instant check-in at the gate.
                    </p>
                  </div>
                  {/* Watermark Icon in Bottom Right Corner with Solid Sharp Color */}
                  <div className="absolute -bottom-2.5 -right-2.5 z-0 pointer-events-none transition-all duration-500 ease-out group-hover:scale-115 group-hover:-rotate-6 group-hover:opacity-45">
                    <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-[#0090AD] opacity-25 stroke-[1.5]" />
                  </div>
                </div>

                {/* Card 2: Verified Schedules */}
                <div 
                  className={cn(
                    "relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-[#F0F6FF] border border-[#D8E6FA] shadow-[0_2px_12px_rgba(0,0,0,0.02)]",
                    "hover:border-[#162054]/40 hover:shadow-[0_16px_36px_-8px_rgba(22,32,84,0.2)] hover:-translate-y-1.5",
                    "group flex flex-col justify-between min-h-[152px] transition-all duration-700 ease-out",
                    aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ transitionDelay: "300ms" }}
                >
                  <div className="relative z-10 space-y-2 pr-6">
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight">Verified Schedules</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Keynote times, stage locations, and speaker lineups kept up to date in real time.
                    </p>
                  </div>
                  {/* Watermark Icon in Bottom Right Corner with Solid Sharp Color */}
                  <div className="absolute -bottom-2.5 -right-2.5 z-0 pointer-events-none transition-all duration-500 ease-out group-hover:scale-115 group-hover:-rotate-6 group-hover:opacity-45">
                    <Calendar className="w-16 h-16 sm:w-20 sm:h-20 text-[#162054] opacity-25 stroke-[1.5]" />
                  </div>
                </div>

                {/* Card 3: Live Product Demos */}
                <div 
                  className={cn(
                    "relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-[#F3F4FD] border border-[#E0E4FB] shadow-[0_2px_12px_rgba(0,0,0,0.02)]",
                    "hover:border-[#4F46E5]/40 hover:shadow-[0_16px_36px_-8px_rgba(79,70,229,0.2)] hover:-translate-y-1.5",
                    "group flex flex-col justify-between min-h-[152px] transition-all duration-700 ease-out",
                    aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  )}
                  style={{ transitionDelay: "450ms" }}
                >
                  <div className="relative z-10 space-y-2 pr-6">
                    <h4 className="text-sm sm:text-base font-bold text-slate-950 tracking-tight">Live Product Demos</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Meet the engineering teams and test live banking, payment, and ERP solutions firsthand.
                    </p>
                  </div>
                  {/* Watermark Icon in Bottom Right Corner with Solid Sharp Color */}
                  <div className="absolute -bottom-2.5 -right-2.5 z-0 pointer-events-none transition-all duration-500 ease-out group-hover:scale-115 group-hover:-rotate-6 group-hover:opacity-45">
                    <Laptop className="w-16 h-16 sm:w-20 sm:h-20 text-[#4F46E5] opacity-25 stroke-[1.5]" />
                  </div>
                </div>
              </div>

              {/* Ecosystem co-brand bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-medium">Co-Engineered By:</span>
                  <a
                    href="https://thefifthlab.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-200"
                    title="The FifthLab"
                  >
                    <img
                      src="/brand/fifthlab-logo.png"
                      alt="The FifthLab"
                      className="h-6 w-auto object-contain"
                    />
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href="https://cwg-plc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-200"
                    title="CWG PLC"
                  >
                    <CwgLogo color="#162054" height={28} className="h-7 w-auto" />
                  </a>
                </div>

                <div 
                  className={cn(
                    "flex items-center gap-3 transition-all duration-700 ease-out",
                    aboutInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  )}
                  style={{ transitionDelay: "600ms" }}
                >
                  <Link
                    href="/events"
                    className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#0090AD]/25 transition-all duration-300 hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0090AD]/35 active:scale-[0.98] overflow-hidden"
                  >
                    <span className="relative z-10">Explore Events</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1.5" />
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  </Link>
                  <Link
                    href="/demo"
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300/90 bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-950 text-xs sm:text-sm font-bold shadow-xs hover:border-slate-400 transition-all duration-300 hover:scale-[1.04] hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span>Platform Demo</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 text-slate-400 group-hover:text-slate-700" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Pricing & Pass Tiers */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/40 backdrop-blur-2xs border-t border-slate-200/60 relative z-10">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#0090AD] uppercase tracking-widest">
              ACCESS PASS TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight">
              Event passes and organizer access
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Free entry for delegates, tools for conference organizers, and custom setups for exhibitors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Free Visitor Pass */}
            <div className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-8 space-y-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  DELEGATE
                </span>
                <div className="text-3xl font-medium text-slate-900">
                  Free
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For attendees, developers, and industry visitors attending open summit sessions.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Access to keynotes and exhibition hall
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Digital QR door pass on your phone
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Book 1-on-1 demos with product teams
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenPassModal("FREE_VISITOR")}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-colors cursor-pointer"
              >
                Claim Free Pass
              </button>
            </div>

            {/* Pro Organizer Pass */}
            <div className="rounded-3xl bg-white/95 backdrop-blur-xs border-2 border-[#0090AD] p-8 space-y-6 shadow-lg relative flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0090AD] text-white text-[10px] font-bold uppercase tracking-wider">
                FEATURED
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[#0090AD] uppercase tracking-wider">
                  ORGANIZER
                </span>
                <div className="text-3xl font-medium text-slate-900">
                  Pro Summit
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For partners and organizations co-hosting summits or conferences.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Event listing on the public schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Custom digital badge branding
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Export attendee roster to CSV
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsPitchModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#0090AD] hover:bg-[#007A94] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Submit Summit Proposal
              </button>
            </div>

            {/* Enterprise Partner Pass */}
            <div className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-8 space-y-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ENTERPRISE
                </span>
                <div className="text-3xl font-medium text-slate-900">
                  Custom
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For institutions and corporate delegations attending private briefings and VIP sessions.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Reserved VIP seats and lounge access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Dedicated 1-on-1 executive demo slots
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Access to private roundtables
                  </li>
                </ul>
              </div>

              <Link
                href="/demo"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs text-center transition-colors block"
              >
                Contact Enterprise Sales
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions — Rich Dark Section Background */}
      <section 
        id="faq"
        ref={faqSectionRef}
        className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white z-10"
        style={{
          backgroundColor: "#060910",
          background: "linear-gradient(180deg, #090E1A 0%, #060910 50%, #04060B 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {/* Ambient subtle cyan/teal background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0090AD]/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-4xl mx-auto space-y-8 text-left relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#30B5C1] uppercase tracking-widest font-mono">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-medium text-white tracking-tight">
              Everything you need to know about{" "}
              <FifthEventsWordmark theme="dark" className="text-2xl sm:text-4xl" />
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn(
                    "rounded-none border transition-all duration-200 overflow-hidden group",
                    isOpen
                      ? "bg-[#0D1526] border-slate-700 shadow-2xl shadow-black/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                      : "bg-[#080D1A]/95 hover:bg-[#0B1222] border-slate-800/90 hover:border-slate-700/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-1 pr-2">
                      <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-slate-500 shrink-0 select-none">
                        0{idx + 1}
                      </span>
                      <span className={cn(
                        "font-semibold text-sm sm:text-base tracking-tight transition-colors",
                        isOpen ? "text-white" : "text-slate-200 group-hover:text-white"
                      )}>
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 shrink-0 transition-transform duration-300",
                        isOpen ? "rotate-180 text-white" : "text-slate-400 group-hover:text-slate-200"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 font-normal sm:pl-14">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modals */}
      <RegisterPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        defaultTier={passModalTier}
        eventId={selectedEventId}
      />

      <PitchProposalModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />

    </div>
  );
}
