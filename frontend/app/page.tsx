"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Check, 
  Lock,
  ChevronDown,
  Layers,
  Users,
  ShieldCheck,
  Star,
  Download,
  RefreshCw,
  Clock,
  Ticket,
  ArrowUpRight
} from "lucide-react";
import EventsCarousel from "@/components/home/EventsCarousel";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import RegisterPassModal from "@/components/modals/RegisterPassModal";
import PitchProposalModal from "@/components/modals/PitchProposalModal";
import { cn } from "@/lib/utils";

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"details" | "info">("details");

  // Public visitor pass & pitch modals
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [passModalTier, setPassModalTier] = useState<"FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER">("FREE_VISITOR");
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  const faqs = [
    {
      q: "What does 'Enterprise Access' include?",
      a: "Enterprise access grants your team full privileges to create events, manage product owner calendars, capture unlimited visitor leads, and export real-time CSV reports.",
    },
    {
      q: "What are the differences between the passes?",
      a: "Free passes allow basic event browsing and briefing requests. Pro & Team passes grant full event creation tools, custom QR badges, unlimited lead capture, and automated calendar routing.",
    },
    {
      q: "How can I upgrade my organization's subscription?",
      a: "You can upgrade your subscription tier at any time directly in your settings tab or by contacting priority support for instant account adjustment.",
    },
    {
      q: "Is attendee data securely isolated?",
      a: "Yes. All captured leads, visitor credentials, and staff attendance manifests are encrypted in real time.",
    },
  ];

  const handleOpenPassModal = (tier: "FREE_VISITOR" | "PRO_ORGANIZER" | "ENTERPRISE_PARTNER") => {
    setPassModalTier(tier);
    setIsPassModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f5f5f7] flex flex-col justify-between selection:bg-cyan-500 selection:text-black font-sans overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section 
        className="relative pt-20 pb-28 px-4 text-center border-b border-white/10 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ 
          backgroundImage: "radial-gradient(circle at center, rgba(8, 9, 11, 0.5) 0%, rgba(8, 9, 11, 0.95) 90%), url('/hero-page.png')" 
        }}
      >
        <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>The FifthLab & CWG PLC Operations</span>
          </div>

          {/* Main Title & Subtitle */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Events & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Lead Intelligence
              </span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Nigeria&apos;s central hub for enterprise summits, direct product lead acquisition, and West Africa Time (WAT) meeting routing.
            </p>
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/demo"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs sm:text-sm transition-all shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Schedule Demo Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => handleOpenPassModal("FREE_VISITOR")}
              className="w-full sm:w-auto px-7 py-3 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-cyan-400" />
              <span>Claim Event Pass</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. Featured Events Carousel Stage */}
      <EventsCarousel />

      {/* 3. Operational Matrix / Terminal Showcase Section */}
      <section className="py-20 px-4 border-t border-white/10 bg-black/70">
        <div className="max-w-[1400px] mx-auto space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">Real-Time Sync Engine</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Interactive Operational Matrix</h2>
            <p className="text-sm text-white/60 font-light">
              Watch live lead assignments, timezone routing, and attendance manifest status across all 36 Nigerian states.
            </p>
          </div>

          {/* Interactive Showcase Component */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0d12] p-4 sm:p-6 shadow-2xl overflow-hidden">
            
            {/* Header / Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-mono text-white/50 ml-2">fifthlab-nexus-terminal.sh</span>
              </div>
              <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setActiveTab("details")}
                  className={cn("px-3 py-1 rounded-md transition-all cursor-pointer", activeTab === "details" ? "bg-cyan-500 text-black font-semibold" : "text-white/60 hover:text-white")}
                >
                  Live Manifest
                </button>
                <button
                  onClick={() => setActiveTab("info")}
                  className={cn("px-3 py-1 rounded-md transition-all cursor-pointer", activeTab === "info" ? "bg-cyan-500 text-black font-semibold" : "text-white/60 hover:text-white")}
                >
                  Product Routing
                </button>
              </div>
            </div>

            {/* Matrix Body */}
            {activeTab === "details" ? (
              <div className="py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left font-light">
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Region</span>
                    <span className="text-emerald-400 font-mono">WAT +1</span>
                  </div>
                  <div className="text-lg font-bold text-white">Lagos Hub</div>
                  <div className="text-xs text-cyan-400 font-mono">100% Manifest Online</div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Active Summits</span>
                    <span className="text-cyan-400 font-mono">LIVE</span>
                  </div>
                  <div className="text-lg font-bold text-white">West Africa Tech</div>
                  <div className="text-xs text-white/60 font-mono">Eko Hotel & Suites</div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Lead Queue</span>
                    <span className="text-amber-400 font-mono">AUTO</span>
                  </div>
                  <div className="text-lg font-bold text-white">Real-Time Dispatch</div>
                  <div className="text-xs text-white/60 font-mono">Direct to Specialist</div>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>QR Verification</span>
                    <span className="text-emerald-400 font-mono">ACTIVE</span>
                  </div>
                  <div className="text-lg font-bold text-white">Desk Check-In</div>
                  <div className="text-xs text-emerald-400 font-mono">Sub-second Scan</div>
                </div>
              </div>
            ) : (
              <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-light">
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
                  <div className="text-xs font-mono text-cyan-400 font-semibold">BULKWAVE CORE PAYMENTS</div>
                  <div className="text-sm font-medium text-white">High-Throughput Enterprise Settlement</div>
                  <div className="text-xs text-white/60">Automated calendar dispatch & routing for Tier-1 financial institutions.</div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/5 space-y-2">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">SMERP ENTERPRISE ERP</div>
                  <div className="text-sm font-medium text-white">Cloud Resource Planning</div>
                  <div className="text-xs text-white/60">Enterprise workflow automation for manufacturing & distribution.</div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 4. Pricing Section (Flexible Event Passes) */}
      <section id="pricing" className="py-20 px-4 border-t border-white/10 bg-black/40">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">Flexible Event Passes</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1">Unlock FifthEvents Passes</h2>
            <p className="text-sm text-white/60 mt-2 max-w-xl mx-auto font-light">
              Simple, transparent event access tiers for solo attendees, growth startups, and enterprise teams.
            </p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn("text-xs font-semibold", billingPeriod === "monthly" ? "text-white" : "text-white/50")}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-cyan-500 p-1 flex items-center transition-all cursor-pointer"
            >
              <div className={cn("w-4 h-4 rounded-full bg-black transition-transform", billingPeriod === "yearly" && "translate-x-6")} />
            </button>
            <span className={cn("text-xs font-semibold flex items-center gap-1.5", billingPeriod === "yearly" ? "text-white" : "text-white/50")}>
              Yearly <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
            </span>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            
            {/* Starter Pass */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-6 flex flex-col justify-between hover:border-white/20 transition-all font-light">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Free Visitor Pass</h3>
                  <p className="text-xs text-white/50 mt-1">For single attendees exploring public tech events</p>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  ₦0 <span className="text-xs font-normal text-white/50">/ forever</span>
                </div>
                <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Browse All Nigerian Tech & Industrial Events</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Schedule Executive Briefings with Product Leads</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Instant Digital QR Ticket Delivery</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPassModal("FREE_VISITOR")}
                className="w-full py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs text-center transition-all cursor-pointer"
              >
                Get Free Pass
              </button>
            </div>

            {/* Pro Pass (Highlighted) */}
            <div className="rounded-2xl border-2 border-cyan-500 bg-cyan-950/20 p-6 space-y-6 flex flex-col justify-between relative shadow-2xl font-light">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider font-mono">
                Pro Organizer
              </span>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Organizer Pro Pass</h3>
                  <p className="text-xs text-white/60 mt-1">Pitch & co-host regular summits with FifthLab</p>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {billingPeriod === "monthly" ? "₦15,000" : "₦12,000"} <span className="text-xs font-normal text-white/50">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-white/80 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Submit Event Proposals & Sponsorship Pitches</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Co-host Tech Summits with CWG & FifthLab</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Executive Speaker & Keynote Pairing</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Priority Board Review within 48 Hours</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setIsPitchModalOpen(true)}
                className="w-full py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs text-center transition-all shadow-lg cursor-pointer"
              >
                Pitch Event & Get Pro Access
              </button>
            </div>

            {/* Enterprise Pass */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-6 flex flex-col justify-between hover:border-white/20 transition-all font-light">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">CWG & FifthLab Corporate</h3>
                  <p className="text-xs text-white/50 mt-1">For enterprise scale & dedicated SLA across West Africa</p>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {billingPeriod === "monthly" ? "₦45,000" : "₦36,000"} <span className="text-xs font-normal text-white/50">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Everything in Pro Pass</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Architecture Walkthroughs</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Custom WAT Timezone Rules</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Account Manager & SLA</li>
                </ul>
              </div>
              <Link 
                href="/demo" 
                className="w-full py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs text-center transition-all cursor-pointer"
              >
                Book Executive Briefing
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Testimonials Section */}
      <TestimonialsSection />

      {/* 6. FAQ Accordion Section */}
      <section className="py-20 px-4 border-t border-white/10 bg-[#07080c] relative overflow-hidden bg-dark-geometric-lines">
        <div className="max-w-3xl mx-auto w-full relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-normal text-white font-heading">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-white/60 font-light">Everything you need to know about FifthEvents passes and lead acquisition.</p>
          </div>

          <div className="space-y-3 font-light">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-white/10 bg-white/5 overflow-hidden transition-all text-left"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm font-medium text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-white/50 transition-transform duration-200 shrink-0 ml-2", openFaq === index && "rotate-180 text-cyan-400")} />
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-white/60 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Visitor Pass Registration Modal */}
      <RegisterPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        defaultTier={passModalTier}
      />

      {/* Pro Organizer Pitch Proposal Modal */}
      <PitchProposalModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />

    </div>
  );
}
