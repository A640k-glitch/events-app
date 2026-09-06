"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Search, CalendarDays, Users, Layers, X, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { resolveProductLogo } from "@/lib/products-data";
import { cn } from "@/lib/utils";

export default function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen, events, leads, products } = useApp();

  // Lock background scroll when command palette is open
  useBodyScrollLock(isCommandPaletteOpen);

  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!isCommandPaletteOpen) return null;

  const trimmedQuery = query.trim().toLowerCase();
  const hasQuery = trimmedQuery.length > 0;

  const filteredEvents = hasQuery
    ? events
        .filter(
          (e) =>
            e.title.toLowerCase().includes(trimmedQuery) ||
            e.location.toLowerCase().includes(trimmedQuery) ||
            (e.city && e.city.toLowerCase().includes(trimmedQuery))
        )
        .slice(0, 4)
    : [];

  const filteredLeads = hasQuery
    ? leads
        .filter(
          (l) =>
            l.visitorName.toLowerCase().includes(trimmedQuery) ||
            (l.company && l.company.toLowerCase().includes(trimmedQuery)) ||
            (l.email && l.email.toLowerCase().includes(trimmedQuery)) ||
            (l.productInterested && l.productInterested.toLowerCase().includes(trimmedQuery))
        )
        .slice(0, 5)
    : [];

  const filteredProducts = hasQuery
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(trimmedQuery) ||
            (p.tagline || "").toLowerCase().includes(trimmedQuery) ||
            (p.ownerName || "").toLowerCase().includes(trimmedQuery) ||
            (p.description || "").toLowerCase().includes(trimmedQuery)
        )
        .slice(0, 5)
    : [];

  const totalResults = filteredProducts.length + filteredLeads.length + filteredEvents.length;

  const handleNavigate = (url: string) => {
    setCommandPaletteOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-in fade-in duration-150"
      onClick={() => {
        setCommandPaletteOpen(false);
        setQuery("");
      }}
    >
      <div 
        className="w-full max-w-2xl bg-white border border-slate-300 shadow-2xl rounded-2xl overflow-hidden font-sans space-y-0 text-left text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative border-b border-slate-200 px-4 py-3.5 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#005B6E] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search products, attendee leads, events, or type to navigate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 text-sm font-medium placeholder-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-slate-600 font-bold shrink-0">
            ESC
          </kbd>
          <button
            onClick={() => {
              setCommandPaletteOpen(false);
              setQuery("");
            }}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Navigation Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-3.5 text-xs">
          
          {/* Default State: Quick Navigation Links when query is empty */}
          {!hasQuery && (
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 px-2 tracking-wider block mb-1.5">
                  Quick Navigation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-[#EAF7F7] border border-slate-200/80 hover:border-[#005B6E]/30 text-left text-slate-800 font-semibold group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#005B6E]">
                        📊
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Dashboard Overview</div>
                        <div className="text-[10.5px] text-slate-500 font-normal">Telemetry &amp; summary</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005B6E] group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavigate("/dashboard/products")}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-[#EAF7F7] border border-slate-200/80 hover:border-[#005B6E]/30 text-left text-slate-800 font-semibold group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#005B6E]">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Product Solutions</div>
                        <div className="text-[10.5px] text-slate-500 font-normal">Demos &amp; roster</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005B6E] group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavigate("/dashboard/leads")}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-[#EAF7F7] border border-slate-200/80 hover:border-[#005B6E]/30 text-left text-slate-800 font-semibold group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#005B6E]">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Attendee Leads CRM</div>
                        <div className="text-[10.5px] text-slate-500 font-normal">Pipeline &amp; bookings</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005B6E] group-hover:translate-x-0.5 transition-all" />
                  </button>

                  <button
                    onClick={() => handleNavigate("/dashboard/events")}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-[#EAF7F7] border border-slate-200/80 hover:border-[#005B6E]/30 text-left text-slate-800 font-semibold group transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#005B6E]">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Events &amp; Attendance</div>
                        <div className="text-[10.5px] text-slate-500 font-normal">Summits &amp; check-in</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005B6E] group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>

              {/* Suggested Search Terms */}
              <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#005B6E]" />
                  <span>Search Suggestions</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Bulkwave", "CWG Financial", "VeriCheck", "Demo Scheduled", "Lagos", "Qualified"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md hover:bg-[#EAF7F7] hover:text-[#005B6E] hover:border-[#005B6E]/40 transition-all cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active Search Results: Products */}
          {hasQuery && filteredProducts.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-2 tracking-wider">
                Products ({filteredProducts.length})
              </span>
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleNavigate("/dashboard/products")}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/90 text-left text-slate-900 group transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                      <img
                        src={resolveProductLogo(p.slug || p.name, p.logoUrl)}
                        alt={p.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/brand/bulkwave-icon.png";
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-950 truncate group-hover:text-[#005B6E]">
                        {p.name}
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate">
                        {p.tagline || p.description}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005B6E] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {/* Active Search Results: Leads */}
          {hasQuery && filteredLeads.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-2 tracking-wider">
                Attendee Leads ({filteredLeads.length})
              </span>
              {filteredLeads.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleNavigate(`/dashboard/leads?search=${encodeURIComponent(l.visitorName)}`)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/90 text-left text-slate-900 group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0 uppercase">
                      {l.visitorName ? l.visitorName.slice(0, 2) : "LD"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-950 truncate">
                        {l.visitorName}{" "}
                        <span className="font-normal text-[11px] text-slate-500">
                          ({l.company})
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-500 truncate">
                        {l.productInterested} • {l.bookingDate ? `📅 ${l.bookingDate}` : "Unscheduled"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-700 flex items-center gap-1.5 shrink-0 ml-2">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      l.status === "Unread" && "bg-slate-400",
                      l.status === "Qualified" && "bg-[#005B6E]",
                      l.status === "Converted" && "bg-emerald-600",
                      l.status === "Followed Up" && "bg-amber-500",
                      l.status === "Closed" && "bg-slate-400"
                    )} />
                    <span>{l.status}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Active Search Results: Events */}
          {hasQuery && filteredEvents.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-2 tracking-wider">
                Events ({filteredEvents.length})
              </span>
              {filteredEvents.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => handleNavigate("/dashboard/events")}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/90 text-left text-slate-900 group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-md bg-[#EAF7F7] border border-[#CEEFEF] text-[#005B6E] flex items-center justify-center shrink-0">
                      <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-950 truncate">{evt.title}</div>
                      <div className="text-[10.5px] text-slate-500 truncate">{evt.location} • {evt.date}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#005B6E] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          )}

          {/* Empty State when Searching and No Results */}
          {hasQuery && totalResults === 0 && (
            <div className="py-8 text-center space-y-2">
              <Search className="w-7 h-7 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Try searching by solution name, company, attendee lead name, or city.
              </p>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="border-t border-slate-200 px-4 py-2 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">FifthEvents</span>
            <span>•</span>
            <span>Instant Search</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3 text-slate-400" />
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono text-[10px] bg-slate-200/80 px-1 rounded">ESC</kbd>
              <span>to close</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
