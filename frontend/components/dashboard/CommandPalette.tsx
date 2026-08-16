"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Search, CalendarDays, Users, Layers, Settings, ExternalLink, X, ArrowRight } from "lucide-react";

export default function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, events, leads, products } = useApp();
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
    p.ownerName.toLowerCase().includes(query.toLowerCase())
  );

  const handleNavigate = (url: string) => {
    setCommandPaletteOpen(false);
    router.push(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div 
        className="w-full max-w-2xl bg-[#161e2e] border border-[#29364d] shadow-2xl rounded-xs overflow-hidden font-sans space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative border-b border-[#29364d] p-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#ff9900]" />
          <input
            type="text"
            autoFocus
            placeholder="Type to search events, leads, products, pages... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-xs font-mono placeholder-[#7d8f9e] outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 text-[#7d8f9e] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Matrix */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4 text-xs font-mono">
          {/* Quick Pages */}
          <div className="space-y-1">
            <span className="px-2 text-[10px] text-[#7d8f9e] uppercase">Quick Navigation</span>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleNavigate("/dashboard")}
                className="p-2 text-left hover:bg-[#232f3e] text-white rounded-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#ff9900]" /> Console Overview
                </span>
                <ArrowRight className="w-3 h-3 text-[#7d8f9e]" />
              </button>

              <button
                onClick={() => handleNavigate("/dashboard/events")}
                className="p-2 text-left hover:bg-[#232f3e] text-white rounded-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5 text-[#0a84ff]" /> Events Discovery
                </span>
                <ArrowRight className="w-3 h-3 text-[#7d8f9e]" />
              </button>

              <button
                onClick={() => handleNavigate("/dashboard/leads")}
                className="p-2 text-left hover:bg-[#232f3e] text-white rounded-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#30d158]" /> Leads Command Center
                </span>
                <ArrowRight className="w-3 h-3 text-[#7d8f9e]" />
              </button>

              <button
                onClick={() => handleNavigate("/demo")}
                className="p-2 text-left hover:bg-[#232f3e] text-[#ff9900] rounded-xs flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" /> Public Demo Booking
                </span>
                <ArrowRight className="w-3 h-3 text-[#7d8f9e]" />
              </button>
            </div>
          </div>

          {/* Events Results */}
          {filteredEvents.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#29364d]">
              <span className="px-2 text-[10px] text-[#0a84ff] uppercase">Matching Events ({filteredEvents.length})</span>
              {filteredEvents.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleNavigate(`/dashboard/events?id=${evt.id}`)}
                  className="p-2 hover:bg-[#232f3e] text-white rounded-xs cursor-pointer flex items-center justify-between"
                >
                  <div className="truncate">
                    <span className="font-bold text-white">{evt.title}</span>
                    <span className="text-[#7d8f9e] text-[10px] ml-2">({evt.location})</span>
                  </div>
                  <span className="text-[10px] text-[#0a84ff]">{evt.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* Leads Results */}
          {filteredLeads.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-[#29364d]">
              <span className="px-2 text-[10px] text-[#30d158] uppercase">Matching Leads ({filteredLeads.length})</span>
              {filteredLeads.slice(0, 3).map((l) => (
                <div
                  key={l.id}
                  onClick={() => handleNavigate(`/dashboard/leads`)}
                  className="p-2 hover:bg-[#232f3e] text-white rounded-xs cursor-pointer flex items-center justify-between"
                >
                  <div className="truncate">
                    <span className="font-bold text-white">{l.visitorName}</span>
                    <span className="text-[#7d8f9e] text-[10px] ml-2">from {l.company}</span>
                  </div>
                  <span className="text-[10px] text-[#30d158]">{l.productInterested}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="p-2 bg-[#0f141d] border-t border-[#29364d] text-[10px] font-mono text-[#7d8f9e] flex items-center justify-between">
          <span>Use ⌘K or ESC anytime to toggle command search</span>
          <span>FifthLab Console Search</span>
        </div>
      </div>
    </div>
  );
}
