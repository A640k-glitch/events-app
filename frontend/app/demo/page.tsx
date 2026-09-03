"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Building, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Layers,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BrandButton } from "@/components/ui/BrandButtons";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export default function DemoBookingPage() {
  const { products, owners, addLead } = useApp();
  
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.name || "Bulkwave Core Payments");
  const [visitorName, setVisitorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [bookingDate, setBookingDate] = useState("2026-09-02");
  const [bookingTime, setBookingTime] = useState("10:00 AM (WAT)");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const availableSlots = [
    "09:30 AM (WAT)",
    "11:00 AM (WAT)",
    "02:00 PM (WAT)",
    "03:30 PM (WAT)",
    "04:45 PM (WAT)"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !email.trim() || !company.trim()) {
      setErrorMessage("Please complete all required contact fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await addLead({
        visitorName: visitorName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || "+234 800 000 0000",
        company: company.trim(),
        productInterested: selectedProduct,
        assignedProductOwner: "Product Specialist",
        bookingDate,
        bookingTime,
        status: "Unread",
        notes: notes.trim() || "Requested 1-on-1 executive demo via web booking portal.",
      });

      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to book session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#111827] flex flex-col justify-between font-sans text-left">
      
      {/* Top Header */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm border-b border-gray-200/80">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#111827] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-[#111827] font-medium">Schedule Briefing</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium text-[#111827] tracking-tight">
            Schedule an Executive Product Briefing
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Connect 1-on-1 with designated FifthLab engineering and product leads. Normalized to West Africa Time (WAT).
          </p>
        </div>
      </section>

      {/* Main Booking Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          
          {isSubmitted ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 sm:p-12 text-center space-y-5 max-w-lg mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#111827]">Briefing Confirmed</h2>
                <p className="text-xs text-[#6B7280]">
                  Your briefing for <strong className="text-[#111827]">{selectedProduct}</strong> has been scheduled for <strong className="text-[#111827]">{bookingDate} • {bookingTime}</strong>.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <Link href="/events">
                  <BrandButton variant="outline" size="sm">
                    View Events
                  </BrandButton>
                </Link>
                <Link href="/">
                  <BrandButton variant="primary" size="sm">
                    Back Home
                  </BrandButton>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* 1. Solution Selection */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-xs">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#0090AD] uppercase font-mono">Step 1</span>
                  <h2 className="text-base font-semibold text-[#111827]">Select Product Solution</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {products.map((prod, idx) => {
                    const isSelected = selectedProduct === prod.name;
                    const palettes = [
                      { bg: "#F3F4FD", border: "#E0E4FB", activeBorder: "#4F46E5" }, // Bulkwave Periwinkle
                      { bg: "#EAF7F7", border: "#CEEFEF", activeBorder: "#0090AD" }, // Finedge Mint
                      { bg: "#FAF2F7", border: "#F6DFEC", activeBorder: "#EAB308" }, // Smerp Blush
                      { bg: "#F0F6FF", border: "#D8E6FA", activeBorder: "#2563EB" }, // Kuleanpay Ice-Blue
                    ];
                    const pTheme = palettes[idx % palettes.length];

                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setSelectedProduct(prod.name)}
                        style={{
                          backgroundColor: pTheme.bg,
                          borderColor: isSelected ? pTheme.activeBorder : pTheme.border,
                        }}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left transition-all cursor-pointer",
                          isSelected
                            ? "shadow-sm scale-[1.02]"
                            : "hover:border-slate-300 opacity-90 hover:opacity-100"
                        )}
                      >
                        <div className="font-bold text-xs text-slate-900">{prod.name}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{prod.tagline}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Schedule Selection */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-xs">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#0090AD] uppercase font-mono">Step 2</span>
                  <h2 className="text-base font-semibold text-[#111827]">Preferred Date & Time (WAT)</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-medium text-gray-700">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-medium text-gray-700">Available WAT Slots</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.slice(0, 4).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingTime(slot)}
                          className={cn(
                            "py-2 px-3 rounded-lg border text-center text-xs font-medium transition-colors cursor-pointer",
                            bookingTime === slot
                              ? "border-[#00B4D8] bg-[#00B4D8] text-[#03045E] font-semibold"
                              : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Contact Details */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-xs">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#0090AD] uppercase font-mono">Step 3</span>
                  <h2 className="text-base font-semibold text-[#111827]">Contact & Organization Info</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-medium text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abraham Akinwole"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-gray-700">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-gray-700">Organization / Enterprise *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Access Bank Holdings"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-gray-700">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2">
                  <label className="font-medium text-gray-700">Specific Areas of Interest</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your current infrastructure, API requirements, or summit discussion goals..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#00B4D8] focus:bg-white resize-none"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>NDPR & GDPR Compliant</span>
                </div>

                <BrandButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Confirm Executive Briefing
                </BrandButton>
              </div>

            </form>
          )}

        </div>
      </section>

    </div>
  );
}
