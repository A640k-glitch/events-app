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
import TerminalLoader from "@/components/ui/great-ui-terminal-loader";
import { cn } from "@/lib/utils";

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"details" | "info">("details");

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

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f5f5f7] flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. Hero Section */}
      <section 
        className="relative pt-20 pb-28 px-4 text-center border-b border-white/10 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ 
          backgroundImage: "radial-gradient(circle at center, rgba(8, 9, 11, 0.5) 0%, rgba(8, 9, 11, 0.95) 90%), url('/hero-page.png')" 
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          

          {/* Product Title */}
          <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-white leading-tight font-heading">
            FifthEvents Platform
          </h1>

          <p className="text-base sm:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
            Next-generation enterprise event management and lead acquisition platform. Streamlined ticketing, real-time analytics, and instant attendee check-in.
          </p>

          {/* Rating Stars & Reviews */}
          <div className="flex items-center justify-center gap-2 text-xs text-white/60 font-light">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span>•</span>
            <span className="text-white">4.90 / 5</span>
            <span>(378 Certified Event Reviews)</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-medium text-sm">
            <Link
              href="/demo"
              className="px-6 py-3 bg-white text-black hover:bg-white/90 transition-all shadow-xl flex items-center gap-2"
            >
              <span>Schedule Executive Demo</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2"
            >
              <span>Organizer Command Hub</span>
            </Link>

            <Link
              href="/#pricing"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg flex items-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Get All Access Pass</span>
            </Link>
          </div>

          {/* Feature List (No Pill / Badge Box Wrappers) */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/70 font-light">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Real-time Telemetry
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Encrypted Lead Pipeline
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Automated Calendar Routing
            </span>
          </div>

        </div>
      </section>

      {/* Texcellence 2026 Flagship Spotlight Section (Open Editorial Layout) */}
      <section className="py-12 px-4 max-w-[1400px] mx-auto w-full border-b border-white/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-left">
            <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
              FLAGSHIP EVENT • AUG 14, 2026 • LAGOS, NIGERIA
            </p>
            <h2 className="text-3xl sm:text-4xl font-normal text-white font-heading">
              Texcellence 2026 Technology Conference
            </h2>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              Co-hosted by <strong className="text-white font-medium">CWG PLC</strong> & <strong className="text-white font-medium">FifthLab Nigeria</strong> at Landmark Centre, Victoria Island. Uniting 8,500+ bank executives, enterprise architects, and technology pioneers across West Africa.
            </p>
            <div className="flex flex-wrap items-center gap-6 text-xs text-white/60 pt-2 font-light">
              <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-blue-400" /> 09:00 AM WAT (West Africa Time)</span>
              <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-emerald-400" /> Keynote Speakers & Executive Briefings</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0 font-medium text-xs">
            <Link
              href="/demo"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-2"
            >
              <span>Register / Book Briefing</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/events"
              className="px-6 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center justify-center gap-2"
            >
              <span>View Staff Manifest</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Events Carousel & Discovery Section */}
      <section id="events" className="py-12 px-4 max-w-[1400px] mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <p className="text-xs text-blue-400 uppercase tracking-widest font-semibold">Live Events Directory</p>
          <h2 className="text-2xl sm:text-4xl font-normal text-white font-heading">Explore Upcoming Conferences & Summits</h2>
        </div>
        <EventsCarousel />
      </section>

      {/* 3. Product Description & Specifications Section (Clean Cream Contrast Layout) */}
      <section className="py-20 px-4 bg-[#faf8f5] text-[#090a0f] relative overflow-hidden bg-geometric-lines border-y border-black/10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
          
          {/* Description Column */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">NIGERIAN ENTERPRISE PLATFORM</p>

            <h3 className="text-3xl sm:text-4xl font-normal text-[#090a0f] tracking-tight font-heading">
              Enterprise Event & Lead Management System
            </h3>

            <p className="text-sm sm:text-base text-[#334155] leading-relaxed font-light">
              FifthEvents equips your organization with powerful event tools—like custom ticket passes, instant lead capture forms, responsive live dashboards, and automated attendee check-in across CWG PLC, Texcellence, and FifthLab Nigeria ecosystems.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/10">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#090a0f] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Streamlined Attendee Manifests
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed font-light">
                  Track team conference attendance, RSVP statuses, and staff deployments in real time.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#090a0f] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Lead Capture & Analytics
                </h4>
                <p className="text-xs text-[#475569] leading-relaxed font-light">
                  Instantly capture visitor demo registrations and track pipeline conversions automatically.
                </p>
              </div>
            </div>
          </div>

          {/* Details & Info Tabs Side Box */}
          <div className="lg:col-span-4 rounded-2xl border border-black/10 bg-[#111318] text-white p-6 space-y-5 shadow-2xl">
            
            {/* Tabs */}
            <div className="flex border-b border-white/10 pb-3 gap-2">
              <button
                onClick={() => setActiveTab("details")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                  activeTab === "details" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                )}
              >
                Platform Stats
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer",
                  activeTab === "info" ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                )}
              >
                Features
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "details" ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5 text-white/70">
                  <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5 text-blue-400" /> Active Registrations</span>
                  <span className="font-bold text-white font-mono">113,736</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-white/70">
                  <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> System Release</span>
                  <span className="font-bold text-white font-mono">2.1.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-white/70">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-emerald-400" /> Timezone Standard</span>
                  <span className="font-bold text-emerald-400 font-mono">WAT (UTC+1)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-white/5 text-white/70">
                  <span>Interactive Modules</span>
                  <span className="font-bold text-white">5 Active Tabs</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-white/70">
                  <span>Corporate Partners</span>
                  <span className="font-bold text-white">CWG PLC & FifthLab</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5 text-white/70">
                  <span>Mobile Layout</span>
                  <span className="font-bold text-emerald-400">100% Responsive (320px+)</span>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 4. Pricing Section (All Access Pass) */}
      <section id="pricing" className="py-20 px-4 border-t border-white/10 bg-black/40">
        <div className="max-w-[1400px] mx-auto text-center space-y-8">
          
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">Flexible Event Passes</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-1">Unlock FifthEvents Passes</h2>
            <p className="text-sm text-white/60 mt-2 max-w-xl mx-auto">
              Simple, transparent event access tiers for solo attendees, growth startups, and enterprise teams.
            </p>
          </div>

          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={cn("text-xs font-semibold", billingPeriod === "monthly" ? "text-white" : "text-white/50")}>Monthly</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-blue-600 p-1 flex items-center transition-all cursor-pointer"
            >
              <div className={cn("w-4 h-4 rounded-full bg-white transition-transform", billingPeriod === "yearly" && "translate-x-6")} />
            </button>
            <span className={cn("text-xs font-semibold flex items-center gap-1.5", billingPeriod === "yearly" ? "text-white" : "text-white/50")}>
              Yearly <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
            </span>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            
            {/* Starter Pass */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-6 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Free Visitor Pass</h3>
                  <p className="text-xs text-white/50 mt-1">For single attendees exploring public events</p>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  ₦0 <span className="text-xs font-normal text-white/50">/ forever</span>
                </div>
                <ul className="space-y-2 text-xs text-white/70 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Browse All Nigerian Tech & Industrial Events</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Schedule Executive Briefings with FifthLab & CWG Leads</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Download .ICS Calendar Invites</li>
                </ul>
              </div>
              <Link href="/demo" className="w-full py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs text-center transition-all">
                Get Free Pass
              </Link>
            </div>

            {/* Pro Pass (Highlighted) */}
            <div className="rounded-2xl border-2 border-blue-500 bg-blue-950/20 p-6 space-y-6 flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                Most Popular
              </span>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Organizer Pro Pass</h3>
                  <p className="text-xs text-white/60 mt-1">For Nigerian growth teams hosting regular events</p>
                </div>
                <div className="text-3xl font-extrabold text-white font-mono">
                  {billingPeriod === "monthly" ? "₦15,000" : "₦12,000"} <span className="text-xs font-normal text-white/50">/ month</span>
                </div>
                <ul className="space-y-2 text-xs text-white/80 pt-4 border-t border-white/10">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Publish Unlimited Events across Nigeria</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Automated Lead Capture Table</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Export CSV Lead Data</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Staff Attendance Manifest Sync</li>
                </ul>
              </div>
              <Link href="/dashboard" className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-all shadow-lg">
                Start Pro Access
              </Link>
            </div>

            {/* Enterprise Pass */}
            <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-6 flex flex-col justify-between hover:border-white/20 transition-all">
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
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Product Owner Profiles</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Custom WAT Timezone Rules</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Account Manager & SLA</li>
                </ul>
              </div>
              <Link href="/dashboard/settings" className="w-full py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs text-center transition-all">
                Contact Sales
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Testimonials Section */}
      <TestimonialsSection />

      {/* 6. FAQ Accordion Section with Dark Geometric Lines */}
      <section className="py-20 px-4 border-t border-white/10 bg-[#07080c] relative overflow-hidden bg-dark-geometric-lines">
        {/* Floating Geometric Vector Lines Graphic Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50" x2="1000" y2="550" stroke="#2563eb" strokeWidth="0.75" strokeDasharray="6 6" />
            <line x1="0" y1="550" x2="1000" y2="50" stroke="#fff" strokeWidth="0.5" opacity="0.2" />
            <circle cx="500" cy="300" r="220" stroke="#2563eb" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.3" />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto w-full relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-normal text-white font-heading">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-white/60 font-light">Everything you need to know about FifthEvents passes and lead acquisition.</p>
          </div>

          <div className="space-y-3 font-light">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-white/10 bg-black/70 backdrop-blur-md overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-medium text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 text-white/50 transition-transform", openFaq === idx && "rotate-180")} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-white/70 border-t border-white/5 pt-3 leading-relaxed font-light">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
