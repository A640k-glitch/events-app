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
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api-client";
import { TableSkeleton } from "@/components/ui/SkeletonLoaders";
import AppleSpinner from "@/components/ui/AppleSpinner";

export default function EventsPage() {
  const { events, deleteEvent, pitches, approvePitch, declinePitch, refreshData } = useApp();
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
      const res = await fetch(`http://localhost:5000/api/events/${selectedEvent.id}/verify-pass`, {
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

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left text-slate-900">
        
        {/* Header Title Bar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-slate-900">
              Events & Attendance
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Manage event schedules, view verified attendee check-ins, and review organizer proposals.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs font-bold shadow-md shadow-[#0090AD]/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create event</span>
            </button>
          </div>
        </div>

        {/* Sliding View Switcher Tabs & Search Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-slate-200/90 border border-slate-300 overflow-x-auto no-scrollbar shadow-2xs">
            {tabOptions.map((t) => {
              const isActive = viewTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setViewTab(t.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap",
                    isActive
                      ? "bg-white text-slate-950 shadow-xs ring-1 ring-slate-300"
                      : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
                  )}
                >
                  <span>{t.label}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                    isActive ? "bg-[#E8F8FA] text-[#0090AD]" : "bg-slate-300 text-slate-800"
                  )}>
                    {t.count}
                  </span>
                  {t.alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          {viewTab === "CATALOG" && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter events by city or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0090AD] shadow-2xs"
              />
            </div>
          )}
        </div>

        {/* 1. Catalog View */}
        {viewTab === "CATALOG" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Event Cards (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {filteredEvents.map((evt) => {
                const isSelected = evt.id === selectedEventId;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={cn(
                      "p-5 rounded-2xl border transition-all cursor-pointer space-y-3 text-left",
                      isSelected
                        ? "border-[#0090AD] bg-[#F4FCFD] shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F8FA] text-[#0090AD] border border-[#20B2AA]/20 uppercase">
                            {evt.category}
                          </span>
                          <span className="text-xs text-gray-500">{evt.date} • {evt.time}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#111827]">{evt.title}</h3>
                        <p className="text-xs text-[#6B7280] line-clamp-2">{evt.description}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingEvent(evt);
                            setIsEditModalOpen(true);
                          }}
                          title="Edit Event & Carousel Fields"
                          className="p-1.5 text-gray-400 hover:text-[#0090AD] rounded-lg hover:bg-[#0090AD]/10 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteEvent(evt.id);
                          }}
                          title="Delete Event"
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#6B7280]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0090AD]" />
                        <span>{evt.location}, {evt.city}</span>
                      </div>
                      <span className="text-emerald-700 font-semibold">
                        {evt.confirmedStaffCount || evt.attendanceManifest?.length || 0} Staff Attending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Event Control & QR Desk Verification (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {selectedEvent && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-6 shadow-2xs sticky top-20 text-left">
                  <div className="space-y-1 pb-3 border-b border-gray-100">
                    <span className="text-[10px] font-semibold text-[#0090AD] uppercase tracking-wider">
                      Event Details
                    </span>
                    <h3 className="text-lg font-bold text-[#111827] leading-snug">{selectedEvent.title}</h3>
                    <p className="text-xs text-[#6B7280]">{selectedEvent.city} • {selectedEvent.date}</p>
                  </div>

                  {/* QR Desk Check-In Scanner Form */}
                  <form onSubmit={handleVerifyPass} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                      <QrCode className="w-4 h-4 text-[#0090AD]" />
                      <span>Check In Attendee</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Pass Code (e.g. FL-5821)..."
                        value={verifyPassCode}
                        onChange={(e) => setVerifyPassCode(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#111827] placeholder:text-gray-400 focus:outline-none focus:border-[#0090AD]"
                      />
                      <button
                        type="submit"
                        disabled={isVerifying}
                        className="px-4 py-1.5 bg-[#0090AD] hover:bg-[#007A94] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isVerifying ? "..." : "Verify"}
                      </button>
                    </div>

                    {verifyResult && (
                      <div className={cn(
                        "p-2.5 rounded-xl text-xs font-medium",
                        verifyResult.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                      )}>
                        {verifyResult.message}
                      </div>
                    )}
                  </form>

                  {/* Staff Attendance Manifest */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
                      <span>Assigned Staff ({selectedEvent.attendanceManifest?.length || 0})</span>
                    </div>

                    <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
                      {(selectedEvent.attendanceManifest || []).map((staff, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-[#111827]">{staff.userName}</div>
                            <div className="text-[10px] text-gray-500">{staff.userRole}</div>
                          </div>
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-md",
                            staff.status === "Attending" ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold" : "bg-amber-50 text-amber-800 border border-amber-200"
                          )}>
                            {staff.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 2. Public Attendees View */}
        {viewTab === "ATTENDEES_ROSTER" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-2xs text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Registered Attendees ({attendeeRoster.length})</h3>
                <p className="text-xs text-[#6B7280]">List of attendees registered for this event.</p>
              </div>

              <button
                onClick={exportAttendeesCsv}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-[#111827] transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0090AD]" />
                <span>Export Attendees CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/90 text-slate-800 uppercase text-[10.5px] font-bold">
                    <th className="py-3 px-4">Pass Code</th>
                    <th className="py-3 px-4">Attendee Name</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Tier</th>
                    <th className="py-3 px-4">Check-in Status</th>
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
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#0090AD]">{a.qrPassCode}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">{a.visitorName}</td>
                        <td className="py-3.5 px-4 text-[#4B5563]">{a.company}</td>
                        <td className="py-3.5 px-4 text-gray-500">{a.email}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px]">
                            {a.ticketTier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-full text-[10px] font-semibold",
                            a.isCheckedIn ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-gray-100 text-gray-600"
                          )}>
                            {a.isCheckedIn ? "Checked In" : "Pending Door Scan"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No attendee registrations for this event yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. Organizer Proposals */}
        {viewTab === "PITCHES" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4 shadow-2xs text-left">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#111827]">Organizer Proposals</h3>
              <p className="text-xs text-[#6B7280]">Proposals submitted by organizers for co-hosted summits.</p>
            </div>

            <div className="space-y-4">
              {pendingPitches.length > 0 ? (
                pendingPitches.map((p) => (
                  <div key={p.id} className="p-5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#111827]">{p.eventTitle}</h4>
                        <p className="text-xs text-[#6B7280]">
                          Proposed by <strong className="text-[#111827]">{p.organizerName}</strong> ({p.organization}) • {p.proposedCity}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approvePitch(p.id, true, "Approved")}
                          className="px-4 py-1.5 rounded-lg bg-[#0090AD] text-white text-xs font-semibold hover:bg-[#007A94] transition-colors cursor-pointer"
                        >
                          Approve Proposal
                        </button>
                        <button
                          onClick={() => declinePitch(p.id, "Declined")}
                          className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-medium hover:bg-white transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#374151] leading-relaxed bg-white p-3 rounded-lg border border-gray-100">
                      {p.pitchDescription}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400">
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
