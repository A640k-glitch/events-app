"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Check, 
  ChevronDown 
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import RegisterPassModal from "@/components/modals/RegisterPassModal";
import PitchProposalModal from "@/components/modals/PitchProposalModal";
import { cn } from "@/lib/utils";
import HeroSpotlightCarousel from "@/components/home/HeroSpotlightCarousel";
import LiveEventsCarousel from "@/components/home/LiveEventsCarousel";
import ScrollLogoBackground from "@/components/home/ScrollLogoBackground";
import FingerprintPattern from "@/components/brand/FingerprintPattern";

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
    <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-between selection:bg-[#00B4D8] selection:text-white font-sans relative">
      {/* Scroll-Driven Dynamic Logo Background Watermark */}
      <ScrollLogoBackground />
      
      {/* 1. Hero Section with Spotlight Carousel & Natural Lighting Imagery */}
      <section className="relative pt-28 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-transparent overflow-hidden">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10 pb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Building the Future of <br className="hidden sm:inline" />
            Integrated Event & Lead Operations.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Empowering FifthLab & CWG product growth with real-time door badge verification, staff attendance rosters, and high-yield attendee lead acquisition.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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

        {/* Dynamic Spotlight Carousel with Natural Lighting Graphics */}
        <div className="pt-2 relative z-10">
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

      {/* 3. Core Capabilities Row with Frosted Black Background & Faint Fingerprint Designs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/85 backdrop-blur-2xl border-y border-white/10 relative overflow-hidden text-white z-10">
        
        {/* Faint Fingerprint Vector Designs in Background */}
        <FingerprintPattern 
          size={520} 
          opacity={0.06} 
          className="absolute -left-28 -top-24 text-[#30B5C1] -rotate-12 pointer-events-none" 
        />
        <FingerprintPattern 
          size={560} 
          opacity={0.07} 
          className="absolute -right-32 -bottom-28 text-white rotate-12 pointer-events-none" 
        />

        {/* Ambient Subtle Cyan/Teal Glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[320px] bg-[#0090AD]/10 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-6xl mx-auto space-y-10 relative z-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#30B5C1] uppercase tracking-widest font-mono">
              ENGINEERED FOR THE FIFTHLAB ECOSYSTEM
            </span>
            <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              Enterprise Event Infrastructure Built for Scale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Keynote Discovery */}
            <div className="rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] p-7 border border-white/[0.08] hover:border-[#30B5C1]/40 backdrop-blur-md shadow-2xl transition-all duration-300 text-left flex flex-col justify-between space-y-6 group">
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
            <div className="rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] p-7 border border-white/[0.08] hover:border-[#30B5C1]/40 backdrop-blur-md shadow-2xl transition-all duration-300 text-left flex flex-col justify-between space-y-6 group">
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
            <div className="rounded-3xl bg-white/[0.04] hover:bg-white/[0.07] p-7 border border-white/[0.08] hover:border-[#30B5C1]/40 backdrop-blur-md shadow-2xl transition-all duration-300 text-left flex flex-col justify-between space-y-6 group">
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

      {/* 4. Pricing & Pass Tiers */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/40 backdrop-blur-2xs border-t border-slate-200/60 relative z-10">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-[#0090AD] uppercase tracking-widest font-mono">
              ACCESS PASS TIERS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
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
                <div className="text-3xl font-extrabold text-slate-900">
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
                <div className="text-3xl font-extrabold text-slate-900">
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
                <div className="text-3xl font-extrabold text-slate-900">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to know about FifthEvents
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
