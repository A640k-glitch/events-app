"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Ticket, 
  Filter,
  CheckCircle2,
  Users
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BrandButton } from "@/components/ui/BrandButtons";
import RegisterPassModal from "@/components/modals/RegisterPassModal";
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
    <div className="min-h-screen bg-[#FBFBFC] text-[#111827] flex flex-col justify-between font-sans">
      
      {/* Header */}
      <section className="pt-32 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto space-y-4 text-left">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#0090AD] uppercase tracking-wider font-mono">
              The FifthLab Schedule
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#111827] tracking-tight">
              Enterprise Events & Summits
            </h1>
            <p className="text-sm text-[#6B7280] max-w-2xl">
              Explore live upcoming technology conferences, banking expositions, and executive product showcases across West Africa.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
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
                        ? "bg-[#111827] text-white font-semibold shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    )}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, topics, or venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#00B4D8] focus:bg-white"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}</span>
            <span className="font-mono">WAT Timezone Sync Active</span>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredEvents.map((evt) => {
                const manifestCount = evt.attendanceManifest?.length || evt.confirmedStaffCount || 0;

                return (
                  <div
                    key={evt.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col justify-between space-y-5 hover:border-gray-300 hover:shadow-xs transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          {evt.category}
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">
                          WAT
                        </span>
                      </div>

                      <Link href={`/events/${evt.id}`}>
                        <h3 className="text-lg font-semibold text-[#111827] leading-snug hover:text-[#0090AD] transition-colors line-clamp-2">
                          {evt.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="truncate">{evt.location}, {evt.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      <span className="text-xs text-gray-500 font-medium">
                        {manifestCount} Staff Attending
                      </span>

                      <div className="flex items-center gap-2">
                        <Link href={`/events/${evt.id}`}>
                          <BrandButton variant="outline" size="sm">
                            Agenda
                          </BrandButton>
                        </Link>
                        <BrandButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleClaimPass(evt.id)}
                        >
                          Pass
                        </BrandButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center rounded-xl border border-dashed border-gray-200 bg-white space-y-3">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
              <div className="text-sm font-semibold text-gray-700">No events found</div>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
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
