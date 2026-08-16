"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { FifthLabEvent } from "@/lib/types";
import AddEventModal from "@/components/modals/AddEventModal";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const { events, toggleAttendance } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left">
        
        {/* Page Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-heading">
                Internal Event Discovery
              </h1>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
                STAFF MANIFEST SYNC
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Track global team conference attendance, schedule briefings, and manage staff manifests in real time.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/60 p-3 border border-white/10 backdrop-blur-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by event, location, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-xs text-white placeholder-white/40 pl-9 pr-3 py-2 outline-none font-light"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto text-xs overflow-x-auto pb-1 sm:pb-0 font-light">
            {["ALL", "SUMMIT", "EXPOSITION", "EXECUTIVE BRIEFING", "CONFERENCE"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  "px-3 py-1.5 text-xs whitespace-nowrap transition-all cursor-pointer",
                  categoryFilter === cat
                    ? "bg-white text-black font-medium"
                    : "bg-white/5 text-white/70 border border-white/10 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Split-Pane View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Events List */}
          <div className="lg:col-span-6 space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center border border-white/10 bg-black/60 text-white/40 text-xs font-light">
                No events match your criteria.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={cn(
                    "p-4 border transition-all cursor-pointer space-y-3",
                    selectedEventId === evt.id
                      ? "border-blue-500 bg-blue-950/20 shadow-xl"
                      : "border-white/10 bg-black/60 hover:border-white/20"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                        {evt.category} • {evt.city}
                      </p>
                      <h3 className="text-sm font-medium text-white mt-0.5 font-heading">{evt.title}</h3>
                    </div>
                    <span className="text-xs text-white/80 font-medium">
                      {evt.date}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 line-clamp-2 font-light">{evt.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/60 font-light">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span className="truncate max-w-[200px]">{evt.location}</span>
                    </span>
                    <span className="text-white flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> {evt.confirmedStaffCount} confirmed
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Selected Event Detail Panel */}
          {selectedEvent && (
            <div className="lg:col-span-6 border border-white/10 bg-black/80 backdrop-blur-xl p-5 space-y-5 sticky top-24">
              
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                    {selectedEvent.category}
                  </p>
                  <h2 className="text-lg font-normal text-white mt-1 font-heading">{selectedEvent.title}</h2>
                  <p className="text-xs text-white/60 mt-1 flex items-center gap-1 font-light">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> {selectedEvent.location}, {selectedEvent.city}
                  </p>
                </div>
              </div>

              <div className="space-y-2 font-light">
                <h4 className="text-xs font-medium text-white uppercase tracking-wider">Event Briefing</h4>
                <p className="text-xs text-white/70 leading-relaxed">{selectedEvent.description}</p>
              </div>

              {/* Attendance Status Selector Buttons */}
              <div className="p-4 border border-white/10 bg-white/5 space-y-3 font-light">
                <span className="text-xs font-medium text-white block">Confirm Staff Attendance Status</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  <button
                    onClick={() => toggleAttendance(selectedEvent.id, "Attending")}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Attending
                  </button>
                  <button
                    onClick={() => toggleAttendance(selectedEvent.id, "Maybe")}
                    className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Tentative
                  </button>
                  <button
                    onClick={() => toggleAttendance(selectedEvent.id, "Declined")}
                    className="py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Decline
                  </button>
                </div>
              </div>

              {/* Staff Attendance Manifest */}
              <div className="space-y-3 font-light">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white">Confirmed Staff Manifest</span>
                  <span className="text-white/50">{selectedEvent.attendanceManifest.length} total staff logged</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedEvent.attendanceManifest.map((member, idx) => (
                    <div key={idx} className="p-2.5 border border-white/5 bg-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img src={member.avatarUrl} alt={member.userName} className="w-7 h-7 object-cover" />
                        <div>
                          <h5 className="font-medium text-white">{member.userName}</h5>
                          <span className="text-[10px] text-white/50">{member.userRole}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[10px] font-medium uppercase tracking-wider",
                        member.status === "Attending" && "text-emerald-400",
                        member.status === "Maybe" && "text-amber-400",
                        member.status === "Declined" && "text-rose-400"
                      )}>
                        {member.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </DashboardLayout>
  );
}
