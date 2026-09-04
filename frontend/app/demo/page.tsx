"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BrandButton } from "@/components/ui/BrandButtons";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface DemoProductItem {
  id: string;
  name: string;
  tagline: string;
  logoUrl: string;
  badge: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

const DEMO_PRODUCTS: DemoProductItem[] = [
  {
    id: "bulkwave",
    name: "Bulkwave",
    tagline: "Bulk Rewards & Communication Engine",
    logoUrl: "/brand/bulkwave-icon.png",
    accentColor: "#4F46E5",
    bgColor: "#F3F4FD",
    borderColor: "#E0E4FB",
    badge: "Payments & Rewards",
  },
  {
    id: "finedge",
    name: "FinEdge",
    tagline: "Core Banking for Microfinance",
    logoUrl: "/brand/finedge-logo.png",
    accentColor: "#0090AD",
    bgColor: "#EAF7F7",
    borderColor: "#CEEFEF",
    badge: "Core Banking",
  },
  {
    id: "smerp",
    name: "Smerp / SmerpGo",
    tagline: "SME & Field-Team ERP Platform",
    logoUrl: "/brand/smerp-icon.png",
    accentColor: "#C026D3",
    bgColor: "#FCEDFF",
    borderColor: "#F5D0FE",
    badge: "Enterprise ERP",
  },
  {
    id: "ucp",
    name: "Unified Cooperative Platform (UCP)",
    tagline: "Digital Platform for Cooperative Societies",
    logoUrl: "/brand/ucp-emblem.png",
    accentColor: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#E4DEFD",
    badge: "Cooperative Tech",
  },
  {
    id: "kuleanpay",
    name: "KuleanPay",
    tagline: "AI-Driven Escrow & Secure Payments",
    logoUrl: "/brand/kuleanpay-icon.png",
    accentColor: "#1E3A8A",
    bgColor: "#F0F6FF",
    borderColor: "#D8E6FA",
    badge: "Secure Payments",
  },
  {
    id: "beetvas",
    name: "BeetVAS",
    tagline: "Value Added Services Aggregator",
    logoUrl: "/brand/beetvaslogo.png",
    accentColor: "#DC2626",
    bgColor: "#FFF5F5",
    borderColor: "#FED7D7",
    badge: "Telecom VAS",
  },
  {
    id: "cwg-cloud",
    name: "CWG Cloud Services",
    tagline: "Scalable Cloud Infrastructure & Datacenter",
    logoUrl: "/brand/cwg/cloud.svg",
    accentColor: "#0369A1",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    badge: "Cloud Services",
  },
  {
    id: "cwg-managed",
    name: "CWG Managed Services",
    tagline: "Outsourced IT & Infrastructure Management",
    logoUrl: "/brand/cwg/managed.svg",
    accentColor: "#475569",
    bgColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    badge: "Managed IT",
  },
  {
    id: "cwg-payments",
    name: "Payment Terminal Solutions",
    tagline: "Point-of-Sale Hardware & Merchant Terminals",
    logoUrl: "/brand/cwg/payments.svg",
    accentColor: "#0284C7",
    bgColor: "#F0F9FF",
    borderColor: "#BAE6FD",
    badge: "Terminal Solutions",
  },
  {
    id: "cwg-infra",
    name: "IT Infrastructure Services",
    tagline: "Data Center, Hardware & Architecture",
    logoUrl: "/brand/cwg/infrastructure.svg",
    accentColor: "#0F766E",
    bgColor: "#F0FDFA",
    borderColor: "#CCFBF1",
    badge: "Infrastructure",
  },
  {
    id: "cwg-software",
    name: "Enterprise Software Services",
    tagline: "Custom Development, Integration & QA",
    logoUrl: "/brand/cwg/software.svg",
    accentColor: "#7C3AED",
    bgColor: "#FAF5FF",
    borderColor: "#F3E8FF",
    badge: "Custom Software",
  },
  {
    id: "cwg-atm",
    name: "CWG Self-Service & ATM Solutions",
    tagline: "Banking Hardware & Fleet Management",
    logoUrl: "/brand/cwg/atm.svg",
    accentColor: "#475569",
    bgColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    badge: "CWG Hardware",
  },
];

function DemoBookingContent() {
  const searchParams = useSearchParams();
  const { addLead } = useApp();

  const productQuery = searchParams.get("product") || searchParams.get("p") || "";
  
  // Find initial matching product from query param or default to Bulkwave
  const initialProduct = DEMO_PRODUCTS.find(
    (p) =>
      p.id.toLowerCase() === productQuery.toLowerCase() ||
      p.name.toLowerCase().includes(productQuery.toLowerCase())
  ) || DEMO_PRODUCTS[0];

  const [selectedProduct, setSelectedProduct] = useState<DemoProductItem>(initialProduct);
  const [visitorName, setVisitorName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [bookingDate, setBookingDate] = useState("2026-09-15");
  const [bookingTime, setBookingTime] = useState("10:00 AM (WAT)");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sync state if query param changes dynamically
  useEffect(() => {
    if (productQuery) {
      const match = DEMO_PRODUCTS.find(
        (p) =>
          p.id.toLowerCase() === productQuery.toLowerCase() ||
          p.name.toLowerCase().includes(productQuery.toLowerCase())
      );
      if (match) {
        setSelectedProduct(match);
      }
    }
  }, [productQuery]);

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
        productInterested: selectedProduct.name,
        assignedProductOwner: "Enterprise Demo Desk",
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
            <Link href="/products" className="hover:text-[#111827]">
              Products
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-[#111827] font-medium">Book a Demo</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-medium text-[#111827] tracking-tight">
            Book a Live Product Demo
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Connect 1-on-1 with product teams behind FifthLab and CWG fintech solutions. All times in West Africa Time (WAT).
          </p>
        </div>
      </section>

      {/* Main Booking Form */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-4xl mx-auto">
          
          {isSubmitted ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 sm:p-12 text-center space-y-5 max-w-lg mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#111827]">Demo Request Confirmed</h2>
                <p className="text-xs text-[#6B7280]">
                  Your demo for <strong className="text-[#111827]">{selectedProduct.name}</strong> has been scheduled for <strong className="text-[#111827]">{bookingDate} • {bookingTime}</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 space-y-1 text-left font-mono">
                <div>Attendee: <strong className="text-gray-900">{visitorName}</strong></div>
                <div>Organization: <strong className="text-gray-900">{company}</strong></div>
                <div>Confirmation email: <strong className="text-[#0090AD]">{email}</strong></div>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                >
                  Book Another Demo
                </button>
                <Link href="/">
                  <BrandButton variant="primary" size="sm">
                    Return Home
                  </BrandButton>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {errorMessage}
                </div>
              )}

              {/* 1. Solution Selection: 12 Product Icons in 3-Column Stacked Grid */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[#0090AD] uppercase font-mono">Step 1</span>
                    <h2 className="text-base font-semibold text-[#111827]">Select Product Solution</h2>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">12 Solutions Available</span>
                </div>

                {/* 3x12 Stacked Grid (3 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DEMO_PRODUCTS.map((prod) => {
                    const isSelected = selectedProduct.id === prod.id;

                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => setSelectedProduct(prod)}
                        style={{
                          backgroundColor: isSelected ? prod.bgColor : "#FFFFFF",
                          borderColor: isSelected ? prod.accentColor : "#E5E7EB",
                        }}
                        className={cn(
                          "p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer relative flex items-start gap-3 group",
                          isSelected
                            ? "shadow-sm scale-[1.01] ring-2 ring-[#0090AD]/20"
                            : "hover:border-slate-300 hover:bg-slate-50/70"
                        )}
                      >
                        {/* Authentic Product Icon */}
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200/80 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                          <img
                            src={prod.logoUrl}
                            alt={prod.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-slate-900 leading-snug truncate">
                              {prod.name}
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-[#0090AD] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-1 leading-snug">
                            {prod.tagline}
                          </p>
                          <span className="inline-block text-[9.5px] font-semibold text-slate-400 font-mono uppercase tracking-wider pt-0.5">
                            {prod.badge}
                          </span>
                        </div>
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
                    <label className="font-medium text-gray-700">Preferred Date *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="font-medium text-gray-700">Available WAT Slots *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.slice(0, 4).map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingTime(slot)}
                          className={cn(
                            "py-2 px-3 rounded-lg border text-center text-xs font-medium transition-colors cursor-pointer",
                            bookingTime === slot
                              ? "border-[#0090AD] bg-[#E6F8FB] text-[#00829B] font-semibold shadow-2xs"
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
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Adebayo Adeleke"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-gray-700">Work Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-gray-700">Organization / Enterprise *</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Access Bank Holdings"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-medium text-gray-700">Phone / WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="+234 800 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#0090AD] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-1">
                  <label className="font-medium text-gray-700">Specific Areas of Interest</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your current infrastructure, API requirements, or summit discussion goals..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0090AD] focus:bg-white resize-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2 text-[11px] text-gray-500 font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>NDPR & Enterprise Security Compliant</span>
                </div>

                <BrandButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto px-8"
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

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent flex items-center justify-center">
          <div className="text-xs text-slate-500">Loading booking portal...</div>
        </div>
      }
    >
      <DemoBookingContent />
    </Suspense>
  );
}
