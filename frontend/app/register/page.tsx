"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Building, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Download
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api-client";
import { BrandButton } from "@/components/ui/BrandButtons";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import TicketPassModal, { TicketPassData } from "@/components/modals/TicketPassModal";
import PrivacyModal from "@/components/modals/PrivacyModal";
import TermsModal from "@/components/modals/TermsModal";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

function RegisterPassContent() {
  const searchParams = useSearchParams();
  const { events } = useApp();

  const eventParam = searchParams.get("event") || searchParams.get("eventId") || "";
  const tierParam = searchParams.get("tier") || "FREE_VISITOR";

  const [selectedEventId, setSelectedEventId] = useState(eventParam);
  const [ticketTier, setTicketTier] = useState(tierParam);
  const [visitorName, setVisitorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedTicket, setConfirmedTicket] = useState<TicketPassData | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Sync event from query param or default to first upcoming event
  useEffect(() => {
    if (eventParam) {
      setSelectedEventId(eventParam);
    } else if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  }, [eventParam, events, selectedEventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !email.trim() || !company.trim()) {
      setErrorMessage("Please fill in all required contact fields.");
      return;
    }

    const targetEventId = selectedEventId || events[0]?.id;
    if (!targetEventId) {
      setErrorMessage("Please select an upcoming event from the list.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const res = await api.registerForEvent(targetEventId, {
        visitorName: visitorName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || "+234 800 000 0000",
        company: company.trim(),
        ticketTier,
      });

      if (res.success && res.data) {
        const matchingEvent = events.find((evt) => evt.id === targetEventId);
        const resolvedEvent = res.data.event || {
          title: matchingEvent?.title || "Technology Summit",
          date: matchingEvent?.date || "Upcoming",
          time: matchingEvent?.time || "09:00 AM - 05:00 PM WAT",
          location: matchingEvent?.location || "Convention Centre",
          city: matchingEvent?.city || "Lagos, Nigeria",
        };

        const ticketData: TicketPassData = {
          visitorName: res.data.visitorName || visitorName.trim(),
          email: res.data.email || email.trim().toLowerCase(),
          company: res.data.company || company.trim(),
          ticketTier: res.data.ticketTier || ticketTier,
          qrPassCode: res.data.qrPassCode || `PASS-${Date.now().toString(36).toUpperCase()}`,
          qrBadgeDataUrl: res.data.qrBadgeDataUrl || "",
          event: resolvedEvent,
        };

        setConfirmedTicket(ticketData);
        setIsPassModalOpen(true);
        confetti({
          particleCount: 75,
          spread: 55,
          origin: { y: 0.4 },
        });
      } else {
        throw new Error(res.error || "Event registration could not be completed.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-between font-sans text-left">
      
      {/* Top Header Banner with Biometric Ambient Accents */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 overflow-hidden">
        {/* Vector Background Accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#0090AD]/5 rounded-full blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          <FingerprintPattern
            size={560}
            opacity={0.14}
            strokeWidth={1.3}
            className="absolute -right-16 -top-28 text-[#0090AD] rotate-12"
          />
          <FingerprintPattern
            size={380}
            opacity={0.08}
            strokeWidth={1.1}
            className="absolute -left-12 -bottom-28 text-[#0284C7] -rotate-12"
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#111827] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <Link href="/events" className="hover:text-[#111827] transition-colors">
              Events
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-[#111827] font-medium">Public Pass Registration</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0090AD] uppercase tracking-wider font-mono">
                Open Registration
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • No login or account required
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight">
              Claim Your Digital Summit Pass
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl leading-relaxed">
              Register for official access passes to flagship technology summits and industry conferences. Your instant cryptographic QR door badge will be delivered directly to your email.
            </p>
          </div>
        </div>
      </section>

      {/* Main Registration Area */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
              
              <div className="space-y-1 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">
                  Attendee Pass Details
                </h2>
                <p className="text-xs text-slate-500">
                  Fill in your details below. Free for all industry guests, developers, and delegates.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <span className="font-bold">Error:</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 text-xs">
                
                {/* 1. Select Event */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Select Upcoming Summit or Conference *
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all"
                  >
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.title} ({evt.city}) • {evt.date}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Select Pass Tier */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Select Pass Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "FREE_VISITOR", label: "Free Visitor", price: "₦0" },
                      { id: "PRO_ORGANIZER", label: "Pro Pass", price: "₦15,000" },
                      { id: "ENTERPRISE_PARTNER", label: "Enterprise", price: "₦50,000" },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setTicketTier(tier.id)}
                        className={cn(
                          "p-3 rounded-xl border text-center transition-all cursor-pointer",
                          ticketTier === tier.id
                            ? "border-[#0090AD] bg-[#EAF7F7] text-[#007A94] font-bold shadow-xs"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span className="block text-xs font-bold">{tier.label}</span>
                        <span className="text-[10.5px] text-slate-500 font-mono mt-0.5 block">{tier.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Attendee Full Name */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Olumide Adeleke"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0090AD] focus:bg-white placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* 4. Corporate Email */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Corporate / Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="olumide@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0090AD] focus:bg-white placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* 5. Company / Organization */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Company / Organization *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stanbic IBTC, Flutterwave, CWG"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0090AD] focus:bg-white placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* 6. Phone Number */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 block">
                    Phone / WhatsApp (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:border-[#0090AD] focus:bg-white placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Privacy compliance notice */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-[11px] text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Your badge information is protected under our{" "}
                    <button
                      type="button"
                      onClick={() => setIsPrivacyOpen(true)}
                      className="text-[#0090AD] font-semibold hover:underline cursor-pointer"
                    >
                      Privacy Policy
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsOpen(true)}
                      className="text-[#0090AD] font-semibold hover:underline cursor-pointer"
                    >
                      Terms
                    </button>
                    . Passes are issued instantaneously.
                  </span>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <BrandButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<ArrowRight className="w-4 h-4 text-white" />}
                    className="w-full !text-white text-white font-bold py-3"
                  >
                    Generate Digital Summit Pass
                  </BrandButton>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Selected Event Overview & Demo Link (5 cols) */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            
            {/* Selected Event Card */}
            {selectedEvent && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-2xs">
                <div className="space-y-1">
                  <span className="text-[10.5px] font-mono font-semibold uppercase text-[#0090AD]">
                    Selected Summit
                  </span>
                  <h3 className="text-base font-bold text-slate-950 leading-snug">
                    {selectedEvent.title}
                  </h3>
                </div>

                <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0090AD] shrink-0" />
                    <span>{selectedEvent.date} • {selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0090AD] shrink-0" />
                    <span>{selectedEvent.location}, {selectedEvent.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#0090AD] shrink-0" />
                    <span>Selected: {ticketTier.replace(/_/g, " ")}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Book Product Demo CTA Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3 shadow-2xs">
              <div className="space-y-1">
                <span className="text-[10.5px] font-mono font-semibold uppercase text-slate-500">
                  Looking for Product Demos?
                </span>
                <h4 className="text-sm font-bold text-slate-950">
                  Book a 1-on-1 Product Walkthrough
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Meet our product engineering specialists for live walkthroughs of Bulkwave, FinEdge, Smerp, and CWG Cloud solutions.
                </p>
              </div>

              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>Schedule Product Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Corporate Staff Link */}
            <div className="text-center text-xs text-slate-500 pt-2">
              <span>FifthLab staff &amp; delegations: </span>
              <Link href="/login" className="text-[#0090AD] font-semibold hover:underline">
                Portal Login →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Confirmed Ticket Modal */}
      {confirmedTicket && (
        <TicketPassModal
          isOpen={isPassModalOpen}
          onClose={() => setIsPassModalOpen(false)}
          ticket={confirmedTicket}
        />
      )}

      {/* Compliance Modals */}
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-xs text-slate-500 font-medium">Loading pass registration...</div>
        </div>
      }
    >
      <RegisterPassContent />
    </Suspense>
  );
}
