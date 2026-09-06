"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Lead, LeadStatus } from "@/lib/types";
import AddLeadModal from "@/components/modals/AddLeadModal";
import { 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  X,
  Calendar,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TableSkeleton } from "@/components/ui/SkeletonLoaders";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

function LeadsContent() {
  const { leads, updateLeadStatus, updateLead, deleteLead, isLoading, owners } = useApp();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || searchParams.get("product") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [recordTypeFilter, setRecordTypeFilter] = useState<"ALL" | "BOOKINGS" | "INBOUND" | "POOL">("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeLeadDrawerId, setActiveLeadDrawerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Lock body scroll when drawer is open
  useBodyScrollLock(Boolean(activeLeadDrawerId));

  useEffect(() => {
    const q = searchParams.get("search") || searchParams.get("product");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const activeLeadDrawer = activeLeadDrawerId ? leads.find((l) => l.id === activeLeadDrawerId) || null : null;

  const totalBookings = leads.filter((l) => Boolean(l.bookingDate || l.bookingTime)).length;
  const totalInbound = leads.length - totalBookings;
  const generalPoolCount = leads.filter((l) => !l.assignedProductOwnerId || l.assignedProductOwner === "General Pool" || l.assignedProductOwner === "Unassigned").length;
  const qualifiedCount = leads.filter((l) => l.status === "Qualified" || l.status === "Converted").length;

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.productInterested.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || l.status.toLowerCase() === statusFilter.toLowerCase();
    const isBooking = Boolean(l.bookingDate || l.bookingTime);
    const isGeneralPool = !l.assignedProductOwnerId || l.assignedProductOwner === "General Pool" || l.assignedProductOwner === "Unassigned";
    const matchesType =
      recordTypeFilter === "ALL" ||
      (recordTypeFilter === "BOOKINGS" && isBooking) ||
      (recordTypeFilter === "INBOUND" && !isBooking) ||
      (recordTypeFilter === "POOL" && isGeneralPool);

    return matchesSearch && matchesStatus && matchesType;
  });

  const exportCsv = () => {
    setIsExporting(true);
    const headers = ["ID", "Name", "Email", "Phone", "Company", "Product", "Owner", "Booking Date", "Time", "Status", "Notes"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.visitorName}"`,
      `"${l.email}"`,
      `"${l.phone || 'N/A'}"`,
      `"${l.company}"`,
      `"${l.productInterested}"`,
      `"${l.assignedProductOwner || 'Unassigned'}"`,
      l.bookingDate || "N/A",
      l.bookingTime || "N/A",
      l.status,
      `"${l.notes || ''}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FifthEvents_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsExporting(false), 800);
  };

  const statusOptions: LeadStatus[] = ["Unread", "Followed Up", "Qualified", "Converted", "Closed"];

  const tabs = [
    { id: "ALL", label: "All Statuses", count: leads.length },
    { id: "Unread", label: "Unread", count: leads.filter((l) => l.status === "Unread").length },
    { id: "Followed Up", label: "Followed Up", count: leads.filter((l) => l.status === "Followed Up").length },
    { id: "Qualified", label: "Qualified", count: leads.filter((l) => l.status === "Qualified").length },
    { id: "Converted", label: "Converted", count: leads.filter((l) => l.status === "Converted").length },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 font-sans text-left text-slate-900">
      
      {/* Header Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950">
            Attendee Leads &amp; Bookings
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportCsv}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-[#005B6E] shrink-0" />
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip - Clean Enterprise Style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Database Leads</span>
          <div className="text-xl font-bold text-slate-950">{leads.length}</div>
          <span className="text-[10.5px] text-slate-500 font-medium">Verified customer accounts</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Confirmed Bookings</span>
          <div className="text-xl font-bold text-[#005B6E] flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{totalBookings}</span>
          </div>
          <span className="text-[10.5px] text-slate-500 font-medium">Scheduled calendar demos</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Inbound Inquiries</span>
          <div className="text-xl font-bold text-slate-950">{totalInbound}</div>
          <span className="text-[10.5px] text-slate-500 font-medium">Awaiting demo scheduling</span>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Qualified &amp; Converted</span>
          <div className="text-xl font-bold text-slate-950">{qualifiedCount}</div>
          <span className="text-[10.5px] text-slate-500 font-medium">Post-walkthrough progress</span>
        </div>
      </div>

      {/* Segment Filter (Lead vs Booking distinction) & Search Toolbar */}
      <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Lead vs Booking primary segment switcher - Image 1 Design */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setRecordTypeFilter("ALL")}
              className={cn(
                "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                recordTypeFilter === "ALL"
                  ? "bg-slate-950 text-white font-bold shadow-xs"
                  : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
              )}
            >
              All Records ({leads.length})
            </button>
            <button
              onClick={() => setRecordTypeFilter("BOOKINGS")}
              className={cn(
                "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                recordTypeFilter === "BOOKINGS"
                  ? "bg-slate-950 text-white font-bold shadow-xs"
                  : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
              )}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Confirmed Bookings ({totalBookings})</span>
            </button>
            <button
              onClick={() => setRecordTypeFilter("INBOUND")}
              className={cn(
                "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                recordTypeFilter === "INBOUND"
                  ? "bg-slate-950 text-white font-bold shadow-xs"
                  : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
              )}
            >
              Inbound Leads ({totalInbound})
            </button>
            <button
              onClick={() => setRecordTypeFilter("POOL")}
              className={cn(
                "h-7.5 px-3 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap",
                recordTypeFilter === "POOL"
                  ? "bg-slate-950 text-white font-bold shadow-xs"
                  : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
              )}
            >
              General Pool ({generalPoolCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, company, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 rounded-md border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#005B6E] font-medium"
            />
          </div>
        </div>

        {/* Secondary Pipeline Status filter tabs - Image 1 Design */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            Pipeline:
          </span>
          {tabs.map((t) => {
            const isActive = statusFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setStatusFilter(t.id)}
                className={cn(
                  "h-6.5 px-2.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                  isActive
                    ? "bg-slate-950 text-white font-bold shadow-xs"
                    : "bg-[#F0F4F8] text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                )}
              >
                <span>{t.label}</span>
                <span className={cn(
                  "text-[9.5px] px-1 rounded font-mono font-bold",
                  isActive ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-700"
                )}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CRM Leads Table - Dense AWS Console Style */}
      <div className="rounded-lg border border-slate-300 bg-white overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100/90 text-slate-800 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-2 px-2.5">Customer &amp; Contact</th>
                <th className="py-2 px-2.5">Company</th>
                <th className="py-2 px-2.5">Product</th>
                <th className="py-2 px-2.5 whitespace-nowrap">Scheduled Demo</th>
                <th className="py-2 px-2.5 whitespace-nowrap">Pipeline Status</th>
                <th className="py-2 px-2.5 whitespace-nowrap">Assigned Specialist</th>
                <th className="py-2 px-2.5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <TableSkeleton rows={5} columns={6} hasAvatar={false} />
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const isBooking = Boolean(lead.bookingDate || lead.bookingTime);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setActiveLeadDrawerId(lead.id)}
                      className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      {/* Visitor & Contact */}
                      <td className="py-2 px-2.5 max-w-[180px]">
                        <div className="font-semibold text-slate-950 truncate">
                          {lead.visitorName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {lead.email}
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-2 px-2.5 font-semibold text-slate-800 whitespace-nowrap max-w-[140px] truncate">
                        {lead.company || "Enterprise Corp"}
                      </td>

                      {/* Product Interest */}
                      <td className="py-2 px-2.5 whitespace-nowrap font-bold text-[#005B6E] text-xs">
                        {lead.productInterested || "Bulkwave"}
                      </td>

                      {/* Demo Schedule / Record Type */}
                      <td className="py-2 px-2.5 whitespace-nowrap">
                        {isBooking ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-950">
                              <Calendar className="w-3 h-3 text-[#005B6E] shrink-0" />
                              <span>{lead.bookingDate}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                              <Clock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                              <span>{lead.bookingTime}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10.5px] font-medium text-slate-400 italic">
                            Unscheduled Lead
                          </span>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-2 px-2.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className="text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded px-2 py-0.5 focus:border-[#005B6E] focus:outline-none cursor-pointer h-7 w-auto"
                        >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                      </td>

                      {/* Assigned Specialist */}
                      <td className="py-2 px-2.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.assignedProductOwnerId || "unassigned"}
                          onChange={async (e) => {
                            const selectedId = e.target.value;
                            const targetOwner = owners.find((o) => o.id === selectedId);
                            await updateLead(lead.id, {
                              assignedProductOwnerId: selectedId === "unassigned" ? null : selectedId,
                              assignedProductOwner: targetOwner ? targetOwner.name : "General Pool",
                            });
                          }}
                          className="text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded px-2 py-0.5 focus:border-[#005B6E] focus:outline-none cursor-pointer h-7 max-w-[150px] truncate"
                        >
                          <option value="unassigned">General Pool (Unassigned)</option>
                          {owners.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                              {owner.name} ({owner.role})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-2.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No leads or demo bookings matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail & Walkthrough Schedule Drawer */}
      {activeLeadDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-end animate-in fade-in duration-150 overscroll-contain"
          onClick={() => setActiveLeadDrawerId(null)}
          onTouchMove={(e) => { if (e.target === e.currentTarget) e.preventDefault(); }}
        >
          <div 
            className="w-full max-w-md h-full max-h-[100dvh] bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200 font-sans text-left border-l border-slate-200 overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Drawer Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-white shrink-0">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-[#005B6E] uppercase tracking-wider block mb-0.5">
                  {activeLeadDrawer.bookingDate || activeLeadDrawer.bookingTime ? "Confirmed Booking Record" : "Inbound Lead Record"}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-950 truncate">{activeLeadDrawer.visitorName}</h2>
                <p className="text-xs text-slate-500 font-medium truncate">{activeLeadDrawer.company}</p>
              </div>
              <button
                onClick={() => setActiveLeadDrawerId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Body with compact spacing on small mobile */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 sm:space-y-4 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-500 uppercase text-[9.5px] sm:text-[10px] font-bold">Company / Organization</span>
                <div className="font-bold text-slate-950 text-xs sm:text-sm">{activeLeadDrawer.company}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <div className="space-y-0.5">
                  <span className="text-slate-500 uppercase text-[9.5px] sm:text-[10px] font-bold">Email</span>
                  <div className="text-slate-800 font-semibold break-all text-xs">{activeLeadDrawer.email}</div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-500 uppercase text-[9.5px] sm:text-[10px] font-bold">Phone</span>
                  <div className="text-slate-800 font-semibold text-xs">{activeLeadDrawer.phone || "N/A"}</div>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-slate-500 uppercase text-[9.5px] sm:text-[10px] font-bold">Product Solution</span>
                <div className="font-bold text-[#005B6E] text-xs sm:text-sm">{activeLeadDrawer.productInterested}</div>
              </div>

              {/* Interactive Demo Booking Scheduling Box */}
              <div className="p-3 sm:p-3.5 bg-slate-50 rounded-xl border border-slate-300 space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-800 uppercase text-[10px] sm:text-[10.5px] font-bold flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-[#005B6E]" />
                    <span>Demo Walkthrough Schedule</span>
                  </span>
                  <span className={cn(
                    "text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded shrink-0",
                    (activeLeadDrawer.bookingDate || activeLeadDrawer.bookingTime)
                      ? "bg-[#005B6E] text-white"
                      : "bg-slate-200 text-slate-700"
                  )}>
                    {(activeLeadDrawer.bookingDate || activeLeadDrawer.bookingTime) ? "Confirmed Booking" : "Unscheduled"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="text-slate-600 uppercase text-[9.5px] sm:text-[10px] font-bold block mb-1">
                      Scheduled Date
                    </label>
                    <input
                      type="date"
                      value={activeLeadDrawer.bookingDate || ""}
                      onChange={async (e) => {
                        await updateLead(activeLeadDrawer.id, { bookingDate: e.target.value });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#005B6E]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 uppercase text-[9.5px] sm:text-[10px] font-bold block mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM - 10:45 AM"
                      value={activeLeadDrawer.bookingTime || ""}
                      onChange={async (e) => {
                        await updateLead(activeLeadDrawer.id, { bookingTime: e.target.value });
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#005B6E]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  {(activeLeadDrawer.bookingDate || activeLeadDrawer.bookingTime) ? (
                    <button
                      type="button"
                      onClick={async () => {
                        await updateLead(activeLeadDrawer.id, { bookingDate: null as any, bookingTime: null as any });
                      }}
                      className="text-[10.5px] sm:text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear Booking (Convert to Unscheduled Lead)
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        const today = new Date().toISOString().split("T")[0];
                        await updateLead(activeLeadDrawer.id, { bookingDate: today, bookingTime: "10:00 AM - 10:45 AM" });
                      }}
                      className="text-[10.5px] sm:text-[11px] font-semibold text-[#005B6E] hover:underline cursor-pointer"
                    >
                      + Quick Book for Today (10:00 AM)
                    </button>
                  )}
                </div>
              </div>

              {/* Live Pipeline Status Selector */}
              <div className="space-y-1">
                <label className="text-slate-600 uppercase text-[9.5px] sm:text-[10px] font-bold block">
                  Pipeline Status
                </label>
                <select
                  value={activeLeadDrawer.status}
                  onChange={(e) => updateLeadStatus(activeLeadDrawer.id, e.target.value as LeadStatus)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005B6E] shadow-2xs cursor-pointer h-8"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Live Assigned Specialist Selector */}
              <div className="space-y-1">
                <label className="text-slate-600 uppercase text-[9.5px] sm:text-[10px] font-bold block">
                  Assigned Lead Specialist
                </label>
                <select
                  value={activeLeadDrawer.assignedProductOwnerId || "unassigned"}
                  onChange={async (e) => {
                    const selectedId = e.target.value;
                    const targetOwner = owners.find((o) => o.id === selectedId);
                    await updateLead(activeLeadDrawer.id, {
                      assignedProductOwnerId: selectedId === "unassigned" ? null : selectedId,
                      assignedProductOwner: targetOwner ? targetOwner.name : "General Pool",
                    });
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#005B6E] shadow-2xs cursor-pointer h-8"
                >
                  <option value="unassigned">Unassigned (General Pool)</option>
                  {owners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} — {owner.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 pb-2">
                <span className="text-slate-500 uppercase text-[9.5px] sm:text-[10px] font-bold">Meeting Notes &amp; Brief</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium text-xs max-h-36 overflow-y-auto">
                  {activeLeadDrawer.notes || "No additional meeting notes provided."}
                </div>
              </div>
            </div>

            {/* Sticky Drawer Footer with safe padding */}
            <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[10.5px] sm:text-[11px] text-slate-400 font-mono">
                FifthEvents Live CRM
              </span>
              <button
                onClick={() => setActiveLeadDrawerId(null)}
                className="px-4 py-1.5 sm:py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
}

export default function LeadsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<TableSkeleton rows={6} columns={6} />}>
        <LeadsContent />
      </Suspense>
    </DashboardLayout>
  );
}
