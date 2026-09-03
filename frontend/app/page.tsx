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
  Sparkles
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
      a: "All summit agendas, keynote schedules, and 1-on-1 executive demo slots are automatically normalized to WAT (UTC+1), ensuring seamless coordination across Lagos, Abuja, and regional teams.",
    },
    {
      q: "Can we track visitor lead routing to specific FifthLab products?",
      a: "Yes. Inbound booth scans and executive demo bookings are directly mapped to product owners for Bulkwave, Finedge, Smerp, and UCP with live CRM exports.",
    },
    {
      q: "Is door pass QR code scanning secure and offline-ready?",
      a: "Door check-in verifications operate with cryptographic QR passcodes, sub-second latency (0.8s avg scan time), and real-time door sync with the operations console.",
    },
    {
      q: "Is attendee lead data compliant with enterprise data policies?",
      a: "Yes. All captured leads, visitor contact records, and staff attendance manifests are securely encrypted and comply fully with Nigeria Data Protection Regulation (NDPR) standards.",
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
                Building the Future of{" "}
                <span className="text-[#00829B]">Integrated Event</span>{" "}
                &amp; Lead Operations.
              </h1>

              <p className="text-sm sm:text-base text-slate-800 font-normal max-w-xl leading-relaxed mx-auto lg:mx-0">
                Empowering <span className="tracking-tight text-slate-950 font-semibold"><strong className="font-bold">fifth</strong><span className="font-normal">lab</span></span> &amp; <strong className="text-slate-950 font-bold">CWG</strong> product growth with real-time door badge verification, staff attendance rosters, and high-yield attendee lead acquisition.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => handleOpenPassModal("FREE_VISITOR")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Explore Summits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Book A Demo →
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
            <span className="text-xs uppercase tracking-widest font-mono text-[#30B5C1]">
              ENGINEERED FOR THE <span className="font-bold">FIFTH</span><span className="font-light">LAB</span> ECOSYSTEM
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              Enterprise Event Infrastructure Built for Scale
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
                  Summit Broadcast & Discovery
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time keynote agendas, speaker indexing, and automatic timezone normalization across Lagos, Abuja, Accra, and Nairobi.
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

            {/* Card 2: Exhibition Lead Capture */}
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
                    alt="Exhibition Hall"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-[#30B5C1] transition-colors">
                  Lead Capture & Product Routing
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instant acquisition of delegate inquiries with automatic routing to designated product engineering specialists for Bulkwave, Finedge, and SMERP.
                </p>
              </div>

              <div>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#30B5C1] hover:text-[#52D1DC] hover:underline"
                >
                  <span>Request lead demo</span>
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
                    alt="QR Verification"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-[#30B5C1] transition-colors">
                  Digital Pass & QR Verification
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rapid door check-ins with cryptographic QR passcodes, live staff rosters, and NDPR-compliant data encryption.
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
                <div className="text-xs font-bold tracking-widest uppercase text-[#0090AD] font-mono">
                  ABOUT <span className="font-bold">FIFTH</span><span className="font-light">EVENTS</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
                  The Operating System for Enterprise Summits &amp; High-Impact Delegations.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                  Co-engineered by <span className="tracking-tight text-slate-900"><strong className="font-bold">fifth</strong><span className="font-light">lab</span></span> and <strong>CWG PLC</strong>, <span className="tracking-tight text-slate-900"><strong className="font-bold">fifth</strong><span className="font-light">Events</span></span> is built specifically to address the operational friction of large-scale corporate summits, financial technology gatherings, and industrial expos across Africa.
                </p>
              </div>

              {/* 3 Value Pillars with thefifthlab.com Signature Pastel Card Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-[#EAF7F7] border border-[#CEEFEF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#0090AD]/40 transition-all space-y-2.5">
                  <QrCode className="w-6 h-6 text-[#0090AD] stroke-[1.75]" />
                  <h4 className="text-sm font-bold text-slate-950 tracking-tight">Instant Door Passes</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Sub-second cryptographic QR verification with offline-first door caching.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F0F6FF] border border-[#D8E6FA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#2563EB]/40 transition-all space-y-2.5">
                  <Users className="w-6 h-6 text-[#162054] stroke-[1.75]" />
                  <h4 className="text-sm font-bold text-slate-950 tracking-tight">Staff Rostering</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated staff assignment manifests and multi-day presence tracking.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F3F4FD] border border-[#E0E4FB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#4F46E5]/40 transition-all space-y-2.5">
                  <Sparkles className="w-6 h-6 text-[#4F46E5] stroke-[1.75]" />
                  <h4 className="text-sm font-bold text-slate-950 tracking-tight">B2B Lead CRM</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Direct routing of delegate inquiries to product engineering specialists.
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
                    <span>Explore Summits</span>
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
            <span className="text-xs font-bold text-[#0090AD] uppercase tracking-widest font-mono">
              ACCESS PASS TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight">
              Simple, transparent event credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Choose your pass tier for keynote admission, booth lead capture, or organizer co-hosting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Free Visitor Pass */}
            <div className="rounded-3xl bg-white/95 backdrop-blur-xs border border-slate-200 p-8 space-y-6 shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  DELEGATE
                </span>
                <div className="text-3xl font-medium text-slate-900">
                  Free
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For individual attendees, tech operators, and industry delegates attending open summit sessions.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Keynote and exhibition hall access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Instant digital QR door pass
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> 1-on-1 executive demo booking
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
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0090AD] text-white text-[10px] font-bold font-mono uppercase tracking-wider">
                FEATURED
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-[#0090AD] uppercase tracking-wider font-mono">
                  ORGANIZER
                </span>
                <div className="text-3xl font-medium text-slate-900">
                  Pro Summit
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For external conference organizers pitching co-hosted summits and verified passes.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Dedicated organizer proposal review
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Custom digital badge branding
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Live attendee roster export
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
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  ENTERPRISE
                </span>
                <div className="text-3xl font-medium text-slate-900">
                  Custom
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For institutions requiring tailored lead routing, API access, and private VIP roundtables.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Unlimited booth lead scanners
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Custom CRM integration & webhooks
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0090AD]" /> Dedicated operations manager
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
            <span className="text-xs font-bold text-[#0090AD] uppercase tracking-widest font-mono">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight">
              Everything you need to know about <span className="tracking-tight"><span className="font-bold">fifth</span><span className="font-light">Events</span></span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left font-bold text-sm text-slate-900 hover:text-[#0090AD] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 shrink-0 transition-transform duration-200 text-slate-400",
                    openFaq === idx ? "rotate-180 text-[#0090AD]" : ""
                  )} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
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
