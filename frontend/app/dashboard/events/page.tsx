"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import AddEventModal from "@/components/modals/AddEventModal";
import EditEventModal from "@/components/modals/EditEventModal";
import { 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Download, 
  QrCode, 
  Users, 
  UserCheck, 
  UserPlus, 
  Check, 
  X,
  Clock,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { TableSkeleton } from "@/components/ui/SkeletonLoaders";
import { motion, AnimatePresence } from "framer-motion";

export default function EventsPage() {
  const { 
    events, 
    deleteEvent, 
    pitches, 
    approvePitch, 
    declinePitch, 
    refreshData, 
    owners, 
    user, 
    toggleAttendance, 
    removeStaffAttendance 
  } = useApp();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [viewTab, setViewTab] = useState<"CATALOG" | "ATTENDEES_ROSTER" | "PITCHES">("CATALOG");

  const [attendeeRoster, setAttendeeRoster] = useState<any[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  
  // Door Check-in Verification State
  const [verifyPassCode, setVerifyPassCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ success: boolean; message: string } | null>(null);

  // New staff member assignment state
  const [selectedStaffToAssign, setSelectedStaffToAssign] = useState("");
  const [isUpdatingAttendance, setIsUpdatingAttendance] = useState(false);

  const pendingPitches = pitches.filter((p) => p.status === "SUBMITTED");
  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const fetchAttendees = useCallback(async (eventId?: string) => {
    const targetId = eventId || selectedEvent?.id;
    if (!targetId) return;
    setIsLoadingAttendees(true);
    try {
      const res = await api.getEventRegistrations(targetId);
      if (res.success && Array.isArray(res.data)) {
        setAttendeeRoster(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch attendees:", err);
    } finally {
      setIsLoadingAttendees(false);
    }
  }, [selectedEvent?.id]);

  useEffect(() => {
    let isMounted = true;
    if (selectedEvent?.id) {
      api.getEventRegistrations(selectedEvent.id).then((res) => {
        if (isMounted && res.success && Array.isArray(res.data)) {
          setAttendeeRoster(res.data);
        }
      }).catch((err) => {
        console.error("Failed to load attendees:", err);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [selectedEvent?.id]);

  const handleVerifyPass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPassCode.trim() || !selectedEvent?.id) return;

    try {
      setIsVerifying(true);
      setVerifyResult(null);
      const res = await fetch(`/api/events/${selectedEvent.id}/verify-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrPassCode: verifyPassCode.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifyResult({ success: true, message: data.message });
        setVerifyPassCode("");
        fetchAttendees(selectedEvent.id);
      } else {
        setVerifyResult({ success: false, message: data.error || "Pass verification failed." });
      }
    } catch {
      setVerifyResult({ success: false, message: "Network error during pass scan." });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedStaffToAssign || !selectedEvent?.id) return;
    try {
      setIsUpdatingAttendance(true);
      await toggleAttendance(selectedEvent.id, "Attending", selectedStaffToAssign);
      setSelectedStaffToAssign("");
    } finally {
      setIsUpdatingAttendance(false);
    }
  };

  const handleStaffStatusChange = async (userId: string, newStatus: "Attending" | "Declined" | "Maybe") => {
    if (!selectedEvent?.id) return;
    try {
      setIsUpdatingAttendance(true);
      await toggleAttendance(selectedEvent.id, newStatus, userId);
    } finally {
      setIsUpdatingAttendance(false);
    }
  };

  const handleRemoveStaff = async (userId: string) => {
    if (!selectedEvent?.id) return;
    try {
      setIsUpdatingAttendance(true);
      await removeStaffAttendance(selectedEvent.id, userId);
    } finally {
      setIsUpdatingAttendance(false);
    }
  };

  const exportAttendeesCsv = () => {
    if (!attendeeRoster.length) return;
    const headers = ["Pass Code", "Attendee Name", "Email", "Company", "Ticket Tier", "Checked In", "Registered At"];
    const rows = attendeeRoster.map((a) => [
      a.qrPassCode,
      `"${a.visitorName}"`,
      `"${a.email}"`,
      `"${a.company}"`,
      a.ticketTier,
      a.isCheckedIn ? "YES" : "NO",
      a.createdAt,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Attendees_${selectedEvent?.title.replace(/[^a-zA-Z0-9]/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.filter((e) => {
    return (
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const tabOptions = [
    { id: "CATALOG", label: "Events Catalog", count: events.length },
    { id: "ATTENDEES_ROSTER", label: "Public Attendees", count: attendeeRoster.length },
    { id: "PITCHES", label: "Organizer Proposals", count: pendingPitches.length, alert: pendingPitches.length > 0 },
  ];

  // Eligible staff members who are not yet in the manifest of the selected event
  const currentManifestUserIds = new Set((selectedEvent?.attendanceManifest || []).map((m) => m.userId));
  const availableStaffToAssign = owners.filter((o) => !currentManifestUserIds.has(o.id));

  // Current logged in user's RSVP status for the selected event
  const currentUserRecord = (selectedEvent?.attendanceManifest || []).find((m) => m.userId === user?.id);

  const handleSelectEvent = (id: string, e?: React.MouseEvent) => {
    setSelectedEventId(id);
    const target = e?.currentTarget as HTMLElement | undefined;
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }, 50);
    }
  };

  const renderSelectedEventPanel = () => {
    if (!selectedEvent) return null;
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5 space-y-4 sticky top-20 text-left shadow-2xs transition-all duration-200">
        {/* Event Overview */}
        <div className="space-y-1 pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-[#005B6E] uppercase tracking-wider">
            Event Roster &amp; Decisions
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-950 leading-snug">{selectedEvent.title}</h3>
          <p className="text-xs text-slate-500 font-medium">{selectedEvent.city} • {selectedEvent.date}</p>
        </div>

        {/* 1. Quick Personal RSVP Decision for Current User - Solid Brand Green Card */}
        <div className="p-3 rounded-lg bg-[#005B6E] text-white space-y-2 shadow-xs border border-[#004754]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white tracking-wide">Your Event Attendance</span>
            <span className="text-[11px] font-medium text-teal-100">
              Status: <strong className="text-white underline decoration-emerald-400 decoration-1">{currentUserRecord?.status || "Not Responded"}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => handleStaffStatusChange(user?.id || "usr_abraham", "Attending")}
              className={cn(
                "flex-1 h-7.5 rounded-md text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5",
                currentUserRecord?.status === "Attending"
                  ? "bg-emerald-500 text-white shadow-xs ring-1 ring-white/50"
                  : "bg-white/15 text-white hover:bg-emerald-500 hover:text-white border border-white/20"
              )}
            >
              <Check className="w-3.5 h-3.5 shrink-0" /> <span>Attending</span>
            </button>
            <button
              type="button"
              onClick={() => handleStaffStatusChange(user?.id || "usr_abraham", "Declined")}
              className={cn(
                "flex-1 h-7.5 rounded-md text-xs font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1.5",
                currentUserRecord?.status === "Declined"
                  ? "bg-rose-600 text-white shadow-xs ring-1 ring-white/50"
                  : "bg-white/15 text-white hover:bg-rose-600 hover:text-white border border-white/20"
              )}
            >
              <X className="w-3.5 h-3.5 shrink-0" /> <span>Decline</span>
            </button>
          </div>
        </div>

        {/* 2. Interactive Staff Attendance Roster */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900">
            <span>Assigned Staff ({selectedEvent.attendanceManifest?.length || 0})</span>
            <span className="text-xs font-semibold text-emerald-700">
              {(selectedEvent.attendanceManifest || []).filter((m) => m.status === "Attending").length} Confirmed
            </span>
          </div>

          {/* Add Staff Selector Dropdown (Clean, Compact Enterprise Dropdown) */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStaffToAssign}
              onChange={(e) => setSelectedStaffToAssign(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#005B6E] h-7.5 min-w-0"
            >
              <option value="">+ Assign staff member...</option>
              {availableStaffToAssign.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAssignStaff}
              disabled={!selectedStaffToAssign || isUpdatingAttendance}
              className="h-7.5 px-3 rounded-md bg-[#005B6E] hover:bg-[#004754] disabled:opacity-40 text-white text-xs font-semibold shadow-xs cursor-pointer whitespace-nowrap shrink-0 transition-colors"
            >
              Assign
            </button>
          </div>

          {/* Staff List with Live Status Dropdown and Remove Button */}
          <div className="divide-y divide-slate-100 max-h-52 overflow-y-auto pr-1">
            {(selectedEvent.attendanceManifest || []).map((staff) => (
              <div key={staff.userId} className="py-1.5 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900 truncate text-xs">{staff.userName}</div>
                  <div className="text-[11px] text-slate-500">{staff.userRole}</div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <select
                    value={staff.status}
                    onChange={(e) => handleStaffStatusChange(staff.userId, e.target.value as any)}
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer bg-white h-7",
                      staff.status === "Attending" && "text-emerald-800 border-emerald-300 bg-emerald-50/70",
                      staff.status === "Declined" && "text-rose-800 border-rose-300 bg-rose-50/70",
                      staff.status === "Maybe" && "text-amber-800 border-amber-300 bg-amber-50/70"
                    )}
                  >
                    <option value="Attending">Attending</option>
                    <option value="Declined">Declined</option>
                    <option value="Maybe">Maybe</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveStaff(staff.userId)}
                    title="Remove from event"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {(selectedEvent.attendanceManifest || []).length === 0 && (
              <div className="py-3 text-center text-xs text-slate-400">
                No corporate personnel assigned yet.
              </div>
            )}
          </div>
        </div>

        {/* QR Desk Check-In Scanner Form */}
        <form onSubmit={handleVerifyPass} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <QrCode className="w-3.5 h-3.5 text-[#005B6E]" />
            <span>Door Pass Verification</span>
          </div>
          
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Pass Code (e.g. FL-5821)..."
              value={verifyPassCode}
              onChange={(e) => setVerifyPassCode(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#005B6E] h-7.5 min-w-0"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="h-7.5 px-3 bg-[#005B6E] hover:bg-[#004754] text-white rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isVerifying ? "..." : "Verify"}
            </button>
          </div>

          {verifyResult && (
            <div className={cn(
              "p-2 rounded-md text-xs font-medium",
              verifyResult.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
            )}>
              {verifyResult.message}
            </div>
          )}
        </form>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left text-slate-900">
        
        {/* Header Title Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Events &amp; Attendance
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Event</span>
            </button>
          </div>
        </div>

        {/* Compact View Switcher Tabs & Search */}
        <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0">
            {tabOptions.map((t) => {
              const isActive = viewTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setViewTab(t.id as any)}
                  className={cn(
                    "h-7 px-2.5 sm:px-3 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0",
                    isActive
                      ? "bg-slate-950 text-white font-bold shadow-xs"
                      : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                  )}
                >
                  <span>{t.label}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded font-mono font-bold",
                    isActive ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"
                  )}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          {viewTab === "CATALOG" && (
            <div className="relative w-full md:w-56 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-7 pl-8 pr-2.5 rounded border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#005B6E] font-medium"
              />
            </div>
          )}
        </div>

        {/* 1. Catalog View */}
        {viewTab === "CATALOG" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left: Event Cards (7 cols) - Clean AWS Enterprise Design with mobile inline roster card */}
            <div className="lg:col-span-7 space-y-2.5">
              {filteredEvents.map((evt) => {
                const isSelected = evt.id === selectedEventId;
                const attendingStaffCount = (evt.attendanceManifest || []).filter((m) => m.status === "Attending").length;

                const isSummit = evt.category === "Summit";
                const isExposition = evt.category === "Exposition";
                const isBriefing = evt.category === "Executive Briefing";

                return (
                  <div key={evt.id} className="space-y-2">
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={(e) => handleSelectEvent(evt.id, e)}
                      className={cn(
                        "p-3 sm:p-4 rounded-lg border transition-all duration-200 cursor-pointer space-y-2 text-left hover:shadow-xs",
                        isSelected
                          ? "border-[#005B6E] bg-[#F4F9FA] ring-2 ring-[#005B6E]/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
                            {/* Clean Typography Badge (No Pill, No Wedge) */}
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider",
                              isSummit && "text-[#005B6E]",
                              isExposition && "text-purple-700",
                              isBriefing && "text-amber-700",
                              !isSummit && !isExposition && !isBriefing && "text-blue-700"
                            )}>
                              {evt.category}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium truncate">{evt.date} • {evt.time}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-950 line-clamp-1">{evt.title}</h3>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.description}</p>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingEvent(evt);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Event"
                            className="p-1 text-slate-400 hover:text-[#005B6E] rounded hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEvent(evt.id);
                            }}
                            title="Delete Event"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-[260px]">
                          <MapPin className="w-3.5 h-3.5 text-[#005B6E] shrink-0" />
                          <span className="truncate">{evt.location}, {evt.city}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-emerald-700 shrink-0">
                          <Users className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{attendingStaffCount} Staff Attending</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Mobile Only: Inline Roster Card displayed immediately under selected event */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="block lg:hidden overflow-hidden pt-1 pb-2"
                        >
                          {renderSelectedEventPanel()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Event Control & Interactive Staff Decision System (5 cols) - Visible on lg+ screens */}
            <div className="hidden lg:block lg:col-span-5 space-y-4">
              <AnimatePresence mode="wait">
                {selectedEvent ? (
                  <motion.div
                    key={selectedEvent.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {renderSelectedEventPanel()}
                  </motion.div>
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
                    Select an event to view roster and attendance decisions.
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        )}

        {/* 2. Public Attendees View - AWS Style Data Table */}
        {viewTab === "ATTENDEES_ROSTER" && (
          <div className="rounded-lg border border-slate-200 bg-white shadow-none text-left overflow-hidden">
            <div className="p-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Registered Attendees ({attendeeRoster.length})</h3>
                <p className="text-xs text-slate-500">List of verified ticketed attendees registered for this event.</p>
              </div>

              <button
                onClick={exportAttendeesCsv}
                className="inline-flex items-center gap-1.5 h-7.5 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#005B6E]" />
                <span>Export Attendees CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold tracking-wider">
                    <th className="py-2 px-3">Pass Code</th>
                    <th className="py-2 px-3">Attendee Name</th>
                    <th className="py-2 px-3">Organization</th>
                    <th className="py-2 px-3">Email</th>
                    <th className="py-2 px-3">Tier</th>
                    <th className="py-2 px-3">Check-in Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingAttendees ? (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <TableSkeleton rows={4} columns={6} hasAvatar={false} />
                      </td>
                    </tr>
                  ) : attendeeRoster.length > 0 ? (
                    attendeeRoster.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 font-mono font-semibold text-[#005B6E]">{a.qrPassCode}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{a.visitorName}</td>
                        <td className="py-2 px-3 text-slate-700">{a.company}</td>
                        <td className="py-2 px-3 text-slate-500">{a.email}</td>
                        <td className="py-2 px-3 font-medium text-slate-700">
                          {a.ticketTier}
                        </td>
                        <td className="py-2 px-3">
                          <span className={cn(
                            "font-semibold text-xs",
                            a.isCheckedIn ? "text-emerald-700" : "text-slate-500"
                          )}>
                            {a.isCheckedIn ? "Checked In" : "Pending Door Scan"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No attendee registrations for this event yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Organizer Proposals - AWS Style */}
        {viewTab === "PITCHES" && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 text-left">
            <div className="pb-2.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-950">Organizer Proposals</h3>
              <p className="text-xs text-slate-500">Proposals submitted by external organizers for co-hosted summits.</p>
            </div>

            <div className="space-y-3">
              {pendingPitches.length > 0 ? (
                pendingPitches.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-950">{p.eventTitle}</h4>
                        <p className="text-[11px] text-slate-600">
                          Proposed by <strong className="text-slate-950">{p.organizerName}</strong> ({p.organization}) • {p.proposedCity}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => approvePitch(p.id, true, "Approved")}
                          className="h-7 px-3 rounded-md bg-[#005B6E] text-white text-xs font-semibold hover:bg-[#004754] transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => declinePitch(p.id, "Declined")}
                          className="h-7 px-2.5 rounded-md border border-slate-300 text-slate-700 text-xs font-medium hover:bg-white transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-2.5 rounded-md border border-slate-200">
                      {p.pitchDescription}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  No pending organizer proposals to review.
                </div>
              )}
            </div>
          </div>
        )}

        <AddEventModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <EditEventModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          event={editingEvent}
          onEventUpdated={refreshData}
        />

      </div>
    </DashboardLayout>
  );
}
