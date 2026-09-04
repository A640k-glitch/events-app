"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
      a: "You can book a demo directly through any event page or the demo booking portal. Select the solution you want to explore—like Bulkwave, FinEdge, or SMERP—and pick a preferred date and time.",
    },
    {
      q: "How do digital event passes work?",
      a: "Once you claim a pass, your digital ticket is ready with a unique QR code. Present it at the door on your phone for quick check-in.",
    },
    {
      q: "Is attendee registration data kept private?",
      a: "Yes. All registrations and contact details are encrypted and stored in full compliance with Nigeria Data Protection Regulation (NDPR) guidelines.",
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

            {/* Left — iPhone 16 Mockup (desktop only) */}
            <div className="flex-shrink-0">
              <IPhoneMockup />
            </div>

            {/* Right — Hero Copy with Enhanced Mobile Readability & Contrast */}
            <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
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

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => handleOpenPassModal("FREE_VISITOR")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Book a Demo &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Spotlight Carousel with Screen-Edge Fixed Hand Anchor */}
        <div className="w-full relative z-10 pt-2 overflow-hidden">
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
                    src="/images/auth/real_lagos_keynote.jpg"
                    alt="Event Discovery"
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
                    src="/images/auth/developer.jpg"
                    alt="Product Demos"
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
                    src="/images/qr_registration.jpg"
                    alt="QR Passes"
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
        className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden z-10 border-t border-slate-200/70 scroll-mt-24"
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Clean Image in an elevated frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Ambient glow ring behind card */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#0090AD]/20 via-[#26B5BA]/15 to-[#162054]/10 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

                {/* Main Photo Card without distracting pills */}
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
              <div className="space-y-3">
                <div className="text-xs font-bold tracking-widest uppercase text-[#0090AD]">
                  ABOUT <span className="font-bold">FIFTH</span><span className="font-light">EVENTS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
                  Built for the events that actually matter in African tech.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                  <span className="tracking-tight text-slate-900"><strong className="font-bold">fifth</strong><span className="font-light">lab</span></span> and <strong>CWG PLC</strong> run fintech conferences, banking expos, and developer summits across Nigeria and West Africa. We built <span className="tracking-tight text-slate-900"><strong className="font-bold">fifth</strong><span className="font-light">Events</span></span> so attendees can easily discover upcoming conferences, get tickets, and explore live solutions on site.
                </p>
              </div>

              {/* 3 Value Pillars with thefifthlab.com Signature Pastel Card Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#EAF7F7] border border-[#CEEFEF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#0090AD]/40 transition-all space-y-2.5">
                  <QrCode className="w-6 h-6 text-[#0090AD] stroke-[1.75]" />
                  <h4 className="text-sm font-bold text-slate-950 tracking-tight">Digital Event Passes</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Save passes to your phone for instant check-in at the gate.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F0F6FF] border border-[#D8E6FA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#2563EB]/40 transition-all space-y-2.5">
                  <Calendar className="w-6 h-6 text-[#162054] stroke-[1.75]" />
                  <h4 className="text-sm font-bold text-slate-950 tracking-tight">Verified Schedules</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Keynote times, stage locations, and speaker lineups kept up to date in real time.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F3F4FD] border border-[#E0E4FB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#4F46E5]/40 transition-all space-y-2.5">
                  <Laptop className="w-6 h-6 text-[#4F46E5] stroke-[1.75]" />
                  <h4 className="text-sm font-bold text-slate-950 tracking-tight">Live Product Demos</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Meet the engineering teams and test live banking, payment, and ERP solutions firsthand.
                  </p>
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
                    className="opacity-90 hover:opacity-100 hover:scale-105 transition-all"
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
                    className="opacity-90 hover:opacity-100 hover:scale-105 transition-all"
                    title="CWG PLC"
                  >
                    <CwgLogo color="#162054" height={28} className="h-7 w-auto" />
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Platform Demo
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

      {/* 5. Frequently Asked Questions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent border-t border-slate-200/60 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#0090AD] uppercase tracking-widest">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-medium text-slate-900 tracking-tight">
              Everything you need to know about <span className="tracking-tight"><span className="font-bold">fifth</span><span className="font-light">Events</span></span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm",
                    isOpen
                      ? "bg-[#0F172A] border-slate-700 shadow-md ring-1 ring-slate-700/50"
                      : "bg-[#0F172A] hover:bg-[#141E34] border-slate-800 hover:border-slate-700"
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 flex items-center justify-between gap-4 text-left font-semibold text-sm text-white hover:text-[#30B5C1] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 text-[#30B5C1]" : "text-slate-400"
                    )} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-3.5 text-xs text-slate-200 leading-relaxed border-t border-slate-800 bg-[#090E1A]">
                      {faq.a}
                    </div>
                  )}
                </div>
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
