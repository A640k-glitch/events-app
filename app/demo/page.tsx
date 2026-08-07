"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useApp } from "@/context/AppContext";
import { 
  ArrowRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  ArrowLeft,
  User,
  Building,
  Mail,
  Ticket
} from "lucide-react";
import TerminalLoader from "@/components/ui/great-ui-terminal-loader";
import { cn } from "@/lib/utils";

export default function PublicDemoBookingPage() {
  const { products, addLead } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedProductId, setSelectedProductId] = useState<string>("prod-paynaira");
  const [selectedDate, setSelectedDate] = useState<string>("2026-08-04");
  const [selectedTime, setSelectedTime] = useState<string>("11:30 AM");

  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  const [liveTimeUtc, setLiveTimeUtc] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTimeUtc(now.toUTCString().slice(17, 25) + " WAT");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const availableDates = [
    { label: "Tue, Aug 4", value: "2026-08-04" },
    { label: "Wed, Aug 5", value: "2026-08-05" },
    { label: "Thu, Aug 6", value: "2026-08-06" },
    { label: "Fri, Aug 7", value: "2026-08-07" },
    { label: "Mon, Aug 10", value: "2026-08-10" },
  ];

  const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorEmail || !company) return;

    addLead({
      visitorName,
      email: visitorEmail,
      company,
      phone: "+234 803 123 4567",
      productInterested: selectedProduct.name,
      assignedProductOwner: selectedProduct.ownerName,
      bookingDate: selectedDate,
      bookingTime: selectedTime,
      status: "Unread",
      notes: notes || "Visitor booked via public portal.",
    });

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });

    setStep(4);
  };

  const handleDownloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FifthLab Systems//Nexus Briefing//EN
BEGIN:VEVENT
SUMMARY:FifthLab ${selectedProduct.name} Executive Briefing
DESCRIPTION:Executive product briefing with ${selectedProduct.ownerName}.
DTSTART:20260804T113000Z
DTEND:20260804T121500Z
LOCATION:FifthLab Virtual Briefing Room (Google Meet)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `FifthLab_Briefing_${selectedProduct.tagline}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-[90vh] text-[#f5f5f7] flex flex-col justify-between selection:bg-blue-600 selection:text-white font-sans relative">
      
      {/* Expanded Main Container (max-w-6xl) */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
            EXECUTIVE BRIEFING PORTAL • WAT TIMEZONE
          </p>

          <h1 className="text-3xl sm:text-5xl font-normal tracking-tight text-white font-heading">
            Schedule an Executive Product Briefing
          </h1>
          
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto font-light">
            Connect directly with designated FifthLab & CWG PLC engineering product leads in West Africa for a personalized architecture walkthrough.
          </p>
        </div>

        {/* Step Progress Indicators (No Pills) */}
        <div className="flex items-center justify-center gap-6 text-xs font-medium max-w-lg mx-auto">
          {[
            { num: 1, label: "Product" },
            { num: 2, label: "Time" },
            { num: 3, label: "Details" },
            { num: 4, label: "Confirmed" }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <span className={cn(
                step === s.num ? "text-blue-400 font-semibold" : step > s.num ? "text-emerald-400" : "text-white/40"
              )}>
                0{s.num}.
              </span>
              <span className={cn(
                step === s.num ? "text-white font-medium" : step > s.num ? "text-white/80" : "text-white/40"
              )}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Expanded High-Contrast Cream Workspace Container with Backdrop Blur */}
        <div className="border border-black/15 bg-[#faf8f5]/90 backdrop-blur-xl text-[#090a0f] p-8 sm:p-12 shadow-2xl relative overflow-hidden bg-geometric-lines">
          
          {/* Floating Vector Lines Graphic Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="100" x2="1000" y2="500" stroke="#2563eb" strokeWidth="0.75" strokeDasharray="6 6" />
              <line x1="0" y1="500" x2="1000" y2="100" stroke="#000" strokeWidth="0.5" opacity="0.2" />
              <circle cx="500" cy="300" r="220" stroke="#2563eb" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.2" />
            </svg>
          </div>

          <div className="relative z-10 space-y-8">
            
            {/* STEP 1: Select Product (Expanded Cards & No Pills) */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-1 text-left border-b border-black/10 pb-4">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Step 01 • Enterprise Selection</p>
                  <h2 className="text-2xl sm:text-3xl font-normal text-[#090a0f] font-heading">Choose a Product to Brief</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((p) => {
                    const isSelected = selectedProductId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProductId(p.id)}
                        className={cn(
                          "p-6 sm:p-8 border-2 transition-all cursor-pointer space-y-4 text-left relative overflow-hidden flex flex-col justify-between min-h-[220px]",
                          isSelected
                            ? "border-blue-600 bg-[#090a0f] text-white shadow-2xl"
                            : "border-black/10 bg-white text-[#090a0f] hover:border-blue-600/50 shadow-sm"
                        )}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            {/* Plain text tagline (NO PILL WRAPPER) */}
                            <p className={cn(
                              "text-xs font-semibold uppercase tracking-wider",
                              isSelected ? "text-blue-400" : "text-blue-700"
                            )}>
                              {p.tagline}
                            </p>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                          </div>

                          <h3 className={cn("text-xl sm:text-2xl font-normal font-heading", isSelected ? "text-white" : "text-[#090a0f]")}>
                            {p.name}
                          </h3>

                          <p className={cn("text-sm leading-relaxed font-light", isSelected ? "text-white/70" : "text-[#475569]")}>
                            {p.description}
                          </p>
                        </div>

                        <div className={cn(
                          "pt-4 border-t flex items-center justify-between text-xs font-medium",
                          isSelected ? "border-white/10 text-white/80" : "border-black/10 text-[#64748b]"
                        )}>
                          <span className="flex items-center gap-2">
                            <User className={cn("w-4 h-4", isSelected ? "text-blue-400" : "text-blue-600")} />
                            <span className="font-medium text-sm">{p.ownerName}</span>
                          </span>
                          <span className="text-emerald-600 font-semibold">Active WAT Sync</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-black/10">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>Select Date & Time</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Select Date & Time (No Pills) */}
            {step === 2 && (
              <div className="space-y-8 text-left">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Step 02 • Calendar Routing</p>
                    <h2 className="text-2xl sm:text-3xl font-normal text-[#090a0f] font-heading">Select Availability Slot</h2>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-medium text-[#475569] hover:text-[#090a0f] flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                {/* Date Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#334155]">Available Meeting Dates</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {availableDates.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setSelectedDate(d.value)}
                        className={cn(
                          "p-4 border-2 text-center text-xs font-medium transition-all cursor-pointer",
                          selectedDate === d.value
                            ? "bg-[#090a0f] text-white border-blue-600 shadow-md"
                            : "bg-white text-[#090a0f] border-black/10 hover:border-blue-600"
                        )}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-[#334155]">Open Time Slots (WAT • UTC+1 West Africa Time)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={cn(
                          "p-4 border-2 text-center text-xs font-medium transition-all cursor-pointer",
                          selectedTime === t
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-[#090a0f] border-black/10 hover:border-blue-600"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-black/10">
                  <button onClick={() => setStep(1)} className="px-6 py-3 border border-black/20 text-xs font-medium text-[#334155] hover:text-[#090a0f]">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <span>Enter Contact Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Enter Visitor Details (No Pills) */}
            {step === 3 && (
              <form onSubmit={handleFormSubmit} className="space-y-8 text-left">
                <div className="flex items-center justify-between border-b border-black/10 pb-4">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">Step 03 • Visitor Credentials</p>
                    <h2 className="text-2xl sm:text-3xl font-normal text-[#090a0f] font-heading">Your Contact Information</h2>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="text-xs font-medium text-[#475569] hover:text-[#090a0f] flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-2">
                    <label className="text-[#334155] font-medium text-sm">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Gbenga Olufemi"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full bg-white border border-black/15 focus:border-blue-600 text-[#090a0f] pl-10 pr-3 py-3 text-sm outline-none font-medium shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[#334155] font-medium text-sm">Work Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                      <input
                        type="email"
                        required
                        placeholder="gbenga.o@flutterwave.com"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        className="w-full bg-white border border-black/15 focus:border-blue-600 text-[#090a0f] pl-10 pr-3 py-3 text-sm outline-none font-medium shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[#334155] font-medium text-sm">Company / Institution *</label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748b]" />
                      <input
                        type="text"
                        required
                        placeholder="Flutterwave Technologies Nigeria"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-white border border-black/15 focus:border-blue-600 text-[#090a0f] pl-10 pr-3 py-3 text-sm outline-none font-medium shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-black/10">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-3 border border-black/20 text-xs font-medium text-[#334155] hover:text-[#090a0f]">
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Confirm Briefing Request</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Confirmed Success State (No Pills) */}
            {step === 4 && (
              <div className="text-center space-y-8 py-8">
                <div className="w-16 h-16 mx-auto bg-emerald-600/10 border border-emerald-600/30 text-emerald-700 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-4xl font-normal text-[#090a0f] font-heading">Executive Briefing Request Confirmed!</h2>
                  <p className="text-sm text-[#334155] max-w-lg mx-auto leading-relaxed font-light">
                    Your meeting with <strong className="text-[#090a0f] font-medium">{selectedProduct.ownerName}</strong> for <span className="text-blue-700 font-medium">{selectedProduct.name}</span> on {selectedDate} at {selectedTime} has been registered in the FifthLab Nigeria command database.
                  </p>
                </div>

                <div className="p-6 border border-black/10 bg-white max-w-lg mx-auto text-xs space-y-3 text-left shadow-sm font-light">
                  <div className="flex justify-between text-[#475569]">
                    <span>Assigned Owner:</span>
                    <span className="font-medium text-[#090a0f]">{selectedProduct.ownerName}</span>
                  </div>
                  <div className="flex justify-between text-[#475569]">
                    <span>Timezone Standard:</span>
                    <span className="font-medium text-blue-700">WAT (UTC+1, West Africa Time)</span>
                  </div>
                  <div className="flex justify-between text-[#475569]">
                    <span>Calendar Invite:</span>
                    <span className="font-medium text-emerald-700">Emitted to {visitorEmail}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-medium text-xs">
                  <button
                    onClick={handleDownloadIcs}
                    className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download .ICS Calendar Event</span>
                  </button>

                  <Link
                    href="/dashboard/leads"
                    className="px-6 py-3.5 border border-black/20 bg-black/5 hover:bg-black/10 text-[#090a0f] transition-all"
                  >
                    View Lead in Command Hub
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
