"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Search, CalendarDays, Users, Layers, X, ArrowRight } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

export default function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, events, leads, products } = useApp();

  // Lock background scroll when command palette is open
  useBodyScrollLock(isCommandPaletteOpen);

  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!isCommandPaletteOpen) return null;

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.location.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = leads.filter((l) =>
    l.visitorName.toLowerCase().includes(query.toLowerCase()) ||
    l.company.toLowerCase().includes(query.toLowerCase()) ||
    l.productInterested.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.tagline || "").toLowerCase().includes(query.toLowerCase()) ||
    (p.ownerName || "").toLowerCase().includes(query.toLowerCase())
  );

  const handleNavigate = (url: string) => {
    setCommandPaletteOpen(false);
    router.push(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-white border border-gray-200 shadow-2xl rounded-2xl overflow-hidden font-sans space-y-0 text-left text-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative border-b border-gray-100 p-4 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#0090AD]" />
          <input
            type="text"
            autoFocus
            placeholder="Search events, attendee leads, products, or settings... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#111827] text-xs font-sans placeholder-gray-400 outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          
          {/* Quick Pages */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 px-3 tracking-wider">
              Navigation
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleNavigate("/dashboard")}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-50 text-left text-gray-700 font-medium"
              >
                <span className="text-[#0090AD]">📊</span> Dashboard Overview
              </button>
              <button
                onClick={() => handleNavigate("/dashboard/events")}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-50 text-left text-gray-700 font-medium"
              >
                <CalendarDays className="w-3.5 h-3.5 text-[#0090AD]" /> Events & Attendance
              </button>
              <button
                onClick={() => handleNavigate("/dashboard/leads")}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-50 text-left text-gray-700 font-medium"
              >
                <Users className="w-3.5 h-3.5 text-[#0090AD]" /> Attendee Leads CRM
              </button>
              <button
                onClick={() => handleNavigate("/dashboard/products")}
                className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-gray-50 text-left text-gray-700 font-medium"
              >
                <Layers className="w-3.5 h-3.5 text-[#0090AD]" /> Product Demos
              </button>
            </div>
          </div>

          {/* Filtered Events */}
          {filteredEvents.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 px-3 tracking-wider">
                Matching Events ({filteredEvents.length})
              </span>
              {filteredEvents.slice(0, 4).map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => handleNavigate("/dashboard/events")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-left text-[#111827]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <CalendarDays className="w-3.5 h-3.5 text-[#0090AD] shrink-0" />
                    <span className="font-semibold truncate">{evt.title}</span>
                    <span className="text-[10px] text-gray-500 font-mono">({evt.city})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          {/* Filtered Leads */}
          {filteredLeads.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 px-3 tracking-wider">
                Matching Leads ({filteredLeads.length})
              </span>
              {filteredLeads.slice(0, 4).map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleNavigate("/dashboard/leads")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-left text-[#111827]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold">{l.visitorName}</span>
                    <span className="text-[10px] text-gray-500">({l.company})</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {l.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Filtered Products */}
          {filteredProducts.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 px-3 tracking-wider">
                Matching Products ({filteredProducts.length})
              </span>
              {filteredProducts.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleNavigate("/dashboard/products")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 text-left text-[#111827]"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="w-3.5 h-3.5 text-[#0090AD] shrink-0" />
                    <span className="font-semibold truncate">{p.name}</span>
                    <span className="text-[10px] text-gray-500">({p.tagline})</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
