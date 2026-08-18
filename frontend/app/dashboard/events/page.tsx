"use client";

import { useState, useEffect } from "react";
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
  Inbox,
  Clock,
  Trash2,
  Ticket,
  QrCode,
  Building,
  RefreshCw,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";

export default function EventsPage() {
  const { events, toggleAttendance, deleteEvent, pitches, approvePitch, declinePitch } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewTab, setViewTab] = useState<"CATALOG" | "ATTENDEES_ROSTER" | "PITCHES">("CATALOG");

  const [attendeeRoster, setAttendeeRoster] = useState<any[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);

  const pendingPitches = pitches.filter((p) => p.status === "SUBMITTED");
  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const fetchAttendees = async (eventId?: string) => {
    const targetId = eventId || selectedEvent?.id;
    if (!targetId) return;
    try {
      setIsLoadingAttendees(true);
      const res = await api.getEventRegistrations(targetId);
      if (res.success && Array.isArray(res.data)) {
        setAttendeeRoster(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch attendees:", err);
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  useEffect(() => {
    if (selectedEvent?.id) {
      fetchAttendees(selectedEvent.id);
    }
  }, [selectedEvent?.id]);

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
                Events Catalog & Manifest Hub
              </h1>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                NEON POSTGRESQL LIVE
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Interactive attendee rosters, staff attendance manifests, and organizer proposal reviews.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Event</span>
          </button>
        </div>

        {/* View Mode Navigation Switcher */}
        <div className="flex bg-white/5 p-1 border border-white/10 max-w-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewTab("CATALOG")}
            className={cn(
              "flex-1 py-2 text-center transition-all cursor-pointer",
              viewTab === "CATALOG"
                ? "bg-cyan-500 text-black font-bold shadow-md"
                : "text-white/60 hover:text-white"
            )}
          >
            Events & Staff Manifest ({events.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setViewTab("ATTENDEES_ROSTER");
              fetchAttendees();
            }}
            className={cn(
              "flex-1 py-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5",
              viewTab === "ATTENDEES_ROSTER"
                ? "bg-cyan-500 text-black font-bold shadow-md"
                : "text-white/60 hover:text-white"
            )}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Public Attendee Passes ({attendeeRoster.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewTab("PITCHES")}
            className={cn(
              "flex-1 py-2 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5",
              viewTab === "PITCHES"
                ? "bg-cyan-500 text-black font-bold shadow-md"
                : "text-white/60 hover:text-white"
            )}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Organizer Pitches ({pendingPitches.length})</span>
          </button>
        </div>

        {/* TAB 1: ATTENDEE BADGES DATA TABLE */}
        {viewTab === "ATTENDEES_ROSTER" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/60 p-3 border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/50">Filter Event:</span>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value);
                    fetchAttendees(e.target.value);
                  }}
                  className="bg-[#13151b] border border-white/10 text-white px-3 py-1.5 text-xs outline-none"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({evt.city})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => fetchAttendees()}
                className="px-3 py-1.5 border border-white/10 hover:border-white/30 text-white text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={cn("w-3 h-3 text-cyan-400", isLoadingAttendees && "animate-spin")} />
                <span>Refresh Table</span>
              </button>
            </div>

            {/* Attendees Structured Table */}
            <div className="border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                      <th className="p-4">Pass Code</th>
                      <th className="p-4">Attendee</th>
                      <th className="p-4">Organization</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Ticket Tier</th>
                      <th className="p-4">Venue Check-In</th>
                      <th className="p-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-light">
                    {attendeeRoster.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-12 text-center text-white/50 text-xs">
                          {isLoadingAttendees ? "Loading attendee badge manifest..." : "No public registrations logged yet for this event."}
                        </td>
                      </tr>
                    ) : (
                      attendeeRoster.map((r) => (
                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-mono text-cyan-400 font-bold text-[11px]">
                            {r.qrPassCode}
                          </td>
                          <td className="p-4 font-medium text-white">
                            {r.visitorName}
                          </td>
                          <td className="p-4 text-white/80">
                            {r.company}
                          </td>
                          <td className="p-4 font-mono text-white/60 text-[11px]">
                            <div>{r.email}</div>
                            <div className="text-[10px] text-white/40">{r.phone}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-medium uppercase">
                              {r.ticketTier ? r.ticketTier.replace(/_/g, " ") : "FREE VISITOR"}
                            </span>
                          </td>
                          <td className="p-4">
                            {r.isCheckedIn ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Checked In</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-white/40">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pending Arrival</span>
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-white/50 font-mono text-[11px]">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZER PITCHES REVIEW */}
        {viewTab === "PITCHES" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-cyan-400" />
                <span>Pro Organizer Proposals Pending Review ({pendingPitches.length})</span>
              </h2>
            </div>

            {pendingPitches.length === 0 ? (
              <div className="p-12 text-center border border-white/10 bg-black/60 text-white/40 text-xs font-light">
                No organizer event pitches currently pending review.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingPitches.map((pitch) => (
                  <div
                    key={pitch.id}
                    className="border border-white/10 bg-black/70 backdrop-blur-xl p-5 space-y-4 text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                          {pitch.organization} • {pitch.proposedCity}
                        </span>
                        <h3 className="text-base font-normal text-white mt-1 font-heading">
                          {pitch.eventTitle}
                        </h3>
                        <p className="text-xs text-white/50 font-light mt-0.5">
                          Submitted by {pitch.organizerName} ({pitch.email} • {pitch.phone})
                        </p>
                      </div>
                      <span className="text-xs text-cyan-400 bg-cyan-950/40 px-2.5 py-1 border border-cyan-500/30">
                        {pitch.expectedAudience.toLocaleString()} Expected
                      </span>
                    </div>

                    <p className="text-xs text-white/70 font-light leading-relaxed">
                      {pitch.pitchDescription}
                    </p>

                    {pitch.sponsorshipRequested && (
                      <div className="p-3 bg-white/5 border border-white/5 text-xs text-white/80 font-light">
                        <strong className="text-white">Sponsorship / Role Requested:</strong> {pitch.sponsorshipRequested}
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2 text-xs font-medium">
                      <button
                        type="button"
                        onClick={() => declinePitch(pitch.id)}
                        className="px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-all"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => approvePitch(pitch.id, true)}
                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer transition-all shadow-md flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Auto-Publish</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EVENTS CATALOG & STAFF MANIFEST */}
        {viewTab === "CATALOG" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/60 p-3 border border-white/10 backdrop-blur-xl">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search events by title, venue, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 text-xs text-white placeholder-white/40 pl-9 pr-3 py-2 outline-none font-light"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto text-xs overflow-x-auto pb-1 sm:pb-0 font-light">
                {["ALL", "SUMMIT", "EXPOSITION", "EXECUTIVE BRIEFING", "CONFERENCE"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
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

            {/* Split-Pane View for Events */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left: Events List */}
              <div className="lg:col-span-6 space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="p-8 text-center border border-white/10 bg-black/60 text-white/40 text-xs font-light">
                    No events found in Neon PostgreSQL database. Click "Publish New Event" above.
                  </div>
                ) : (
                  filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className={cn(
                        "p-4 border transition-all cursor-pointer space-y-3",
                        selectedEventId === evt.id
                          ? "border-cyan-500 bg-cyan-950/20 shadow-xl"
                          : "border-white/10 bg-black/60 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
                            {evt.category} • {evt.city}
                          </p>
                          <h3 className="text-sm font-medium text-white mt-0.5 font-heading">{evt.title}</h3>
                        </div>
                        <span className="text-xs text-white/80 font-medium font-mono">
                          {evt.date}
                        </span>
                      </div>

                      <p className="text-xs text-white/60 line-clamp-2 font-light">{evt.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/60 font-light">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="truncate max-w-[200px]">{evt.location}</span>
                        </span>
                        <span className="text-white flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-cyan-400" /> {evt.confirmedStaffCount} confirmed
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
                      <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                        {selectedEvent.category}
                      </p>
                      <h2 className="text-lg font-normal text-white mt-1 font-heading">{selectedEvent.title}</h2>
                      <p className="text-xs text-white/60 mt-1 flex items-center gap-1 font-light">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {selectedEvent.location}, {selectedEvent.city}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteEvent(selectedEvent.id)}
                      className="p-2 text-white/40 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                        type="button"
                        onClick={() => toggleAttendance(selectedEvent.id, "Attending")}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAttendance(selectedEvent.id, "Maybe")}
                        className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> Tentative
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAttendance(selectedEvent.id, "Declined")}
                        className="py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  </div>

                  {/* Staff Attendance Manifest Tabular Roster */}
                  <div className="space-y-3 font-light">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white">Confirmed Staff Manifest</span>
                      <span className="text-white/50">{selectedEvent.attendanceManifest.length} total staff logged</span>
                    </div>

                    <div className="border border-white/10 bg-black/40 overflow-hidden max-h-56 overflow-y-auto">
                      <table className="w-full text-left text-xs">
                        <tbody className="divide-y divide-white/5">
                          {selectedEvent.attendanceManifest.length === 0 ? (
                            <tr>
                              <td className="p-4 text-center text-white/40 text-xs">No staff RSVPs recorded yet.</td>
                            </tr>
                          ) : (
                            selectedEvent.attendanceManifest.map((member, idx) => (
                              <tr key={idx} className="hover:bg-white/[0.02]">
                                <td className="p-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <img src={member.avatarUrl} alt={member.userName} className="w-7 h-7 object-cover rounded-full" />
                                    <div>
                                      <h5 className="font-medium text-white">{member.userName}</h5>
                                      <span className="text-[10px] text-white/50">{member.userRole}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-2.5 text-right">
                                  <span className={cn(
                                    "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border",
                                    member.status === "Attending" && "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
                                    member.status === "Maybe" && "text-amber-400 border-amber-500/30 bg-amber-500/10",
                                    member.status === "Declined" && "text-rose-400 border-rose-500/30 bg-rose-500/10"
                                  )}>
                                    {member.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

      </div>

      <AddEventModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </DashboardLayout>
  );
}
