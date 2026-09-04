"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ArrowUpRight,
  Ticket, 
  Filter,
  CheckCircle2,
  Users
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BrandButton } from "@/components/ui/BrandButtons";
import RegisterPassModal from "@/components/modals/RegisterPassModal";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import { cn } from "@/lib/utils";

export default function EventsPublicCatalogPage() {
  const { events } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [selectedEventIdForPass, setSelectedEventIdForPass] = useState<string | undefined>(undefined);

  const categories = [
    { id: "ALL", label: "All Categories" },
    { id: "CONFERENCE", label: "Conferences" },
    { id: "SUMMIT", label: "Summits" },
    { id: "EXPOSITION", label: "Expositions" },
    { id: "BRIEFING", label: "Briefings" },
    { id: "WEBINAR", label: "Webinars" },
  ];

  const cities = ["ALL", "Lagos", "Abuja", "Accra", "Nairobi", "Kigali"];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || e.category.toUpperCase() === selectedCategory;

    const matchesCity =
      cityFilter === "ALL" || e.city.toLowerCase() === cityFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity;
  });

  const handleClaimPass = (eventId: string) => {
    setSelectedEventIdForPass(eventId);
    setIsPassModalOpen(true);
  };

  return (
    <div className="min-h-screen text-[#111827] flex flex-col justify-between font-sans">
      
      {/* Header with Biometric Dark Theme & Dense Fingerprint Accent */}
      <section className="relative pt-32 sm:pt-36 pb-14 px-4 sm:px-6 lg:px-8 bg-[#06090e] bg-gradient-to-b from-[#090e17] via-[#06090e] to-[#030508] border-b border-white/[0.08] overflow-hidden text-white">
        
        {/* Soft Radial Ambient Cyan Glow */}
        <div className="absolute -right-24 -top-24 w-[480px] h-[480px] bg-[#26B5BA]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -bottom-28 w-[380px] h-[380px] bg-[#0090AD]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Multiple Dense Fingerprint Vectors Across Background */}
        <FingerprintPattern
          size={680}
          opacity={0.38}
          className="absolute -right-16 -top-32 text-[#26B5BA] rotate-12 pointer-events-none"
        />
        <FingerprintPattern
          size={520}
          opacity={0.24}
          className="absolute right-48 -bottom-36 text-[#30B5C1] -rotate-12 pointer-events-none"
        />
        <FingerprintPattern
          size={480}
          opacity={0.18}
          className="absolute -left-20 -top-24 text-white -rotate-45 pointer-events-none"
        />
        <FingerprintPattern
          size={420}
          opacity={0.16}
          className="absolute -left-28 -bottom-32 text-[#26B5BA] rotate-45 pointer-events-none"
        />
        <FingerprintPattern
          size={360}
          opacity={0.10}
          className="absolute left-1/3 -top-28 text-white rotate-6 pointer-events-none"
        />

        <div className="max-w-6xl mx-auto space-y-6 text-left relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#26B5BA] uppercase tracking-widest font-mono">
              The FifthLab Schedule
            </span>
            <h1 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
              Enterprise Events &amp; Summits
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore live upcoming technology conferences, banking expositions, and executive product showcases across West Africa.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-[#26B5BA] text-slate-950 font-bold shadow-md shadow-[#26B5BA]/20"
                        : "bg-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/[0.08]"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events, topics, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#26B5BA] focus:ring-1 focus:ring-[#26B5BA] backdrop-blur-sm transition-all"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 flex-1 relative overflow-hidden bg-[#F8FAFC]">
        {/* Subtle Ambient Fingerprints in Section Background */}
        <FingerprintPattern
          size={620}
          opacity={0.04}
          className="absolute -right-32 top-24 text-[#0090AD] rotate-45 pointer-events-none"
        />
        <FingerprintPattern
          size={560}
          opacity={0.03}
          className="absolute -left-32 bottom-24 text-slate-900 -rotate-12 pointer-events-none"
        />
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Showing <strong className="text-slate-900">{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? "s" : ""}</span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredEvents.map((evt, idx) => {
                const manifestCount = evt.attendanceManifest?.length || evt.confirmedStaffCount || 0;
                
                // thefifthlab.com Signature Pastel Card Palette mapping
                const cardPalettes = [
                  { bg: "#EAF7F7", border: "#CEEFEF", accent: "#0090AD" }, // Finedge Mint
                  { bg: "#F0F6FF", border: "#D8E6FA", accent: "#2563EB" }, // Kuleanpay Ice-Blue
                  { bg: "#F3F4FD", border: "#E0E4FB", accent: "#4F46E5" }, // Bulkwave Periwinkle
                  { bg: "#FAF2F7", border: "#F6DFEC", accent: "#EAB308" }, // Smerp Rose-Blush
                ];
                const theme = cardPalettes[idx % cardPalettes.length];

                return (
                  <div
                    key={evt.id}
                    style={{
                      backgroundColor: theme.bg,
                      borderColor: theme.border,
                    }}
                    className="group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4 border shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 text-left"
                  >
                    <div className="space-y-4">
                      {/* Top Row: Clean Icon + Action Buttons */}
                      <div className="flex items-center justify-between gap-4 min-h-[50px]">
                        <div className="flex items-center justify-start shrink-0">
                          <Calendar
                            className="w-10 h-10 shrink-0 transition-transform duration-300 group-hover:scale-105"
                            style={{ color: theme.accent }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleClaimPass(evt.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-950 text-white text-xs font-semibold hover:bg-black transition-all shadow-xs cursor-pointer group-hover:scale-105"
                          >
                            <span>Get Pass</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Name & Tagline */}
                      <div className="space-y-1">
                        <Link href={`/events/${evt.id}`}>
                          <h3 className="text-lg font-bold text-slate-950 group-hover:text-[#0090AD] transition-colors tracking-tight line-clamp-2">
                            {evt.title}
                          </h3>
                        </Link>
                        <p className="text-xs sm:text-sm font-semibold text-slate-700">
                          {evt.date} • {evt.time}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>
                    </div>

                    {/* Bottom Metadata Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-black/[0.06]">
                      <span className="text-[10.5px] font-medium text-slate-700 bg-white/90 border border-black/[0.06] px-2.5 py-1 rounded-md shadow-2xs">
                        {evt.location}, {evt.city}
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-700 bg-white/90 border border-black/[0.06] px-2.5 py-1 rounded-md shadow-2xs">
                        {evt.category}
                      </span>
                      {evt.boothNumber && (
                        <span className="text-[10.5px] font-medium text-[#007A94] bg-white/90 border border-[#0090AD]/30 px-2.5 py-1 rounded-md shadow-2xs">
                          {evt.boothNumber}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-white space-y-3 shadow-xs">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-semibold text-slate-800">No events found</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No events matched your current search or category filter. Try clearing your filters.
              </p>
            </div>
          )}

        </div>
      </section>

      <RegisterPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        initialEventId={selectedEventIdForPass}
      />

    </div>
  );
}
