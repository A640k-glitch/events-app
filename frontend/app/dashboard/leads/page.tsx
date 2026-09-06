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

function LeadsContent() {
  const { leads, updateLeadStatus, updateLead, deleteLead, isLoading, owners } = useApp();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || searchParams.get("product") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeLeadDrawerId, setActiveLeadDrawerId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const q = searchParams.get("search") || searchParams.get("product");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  const activeLeadDrawer = activeLeadDrawerId ? leads.find((l) => l.id === activeLeadDrawerId) || null : null;

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.productInterested.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || l.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
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
    { id: "ALL", label: "All Leads", count: leads.length },
    { id: "Unread", label: "Unread", count: leads.filter((l) => l.status === "Unread").length },
    { id: "Followed Up", label: "Followed Up", count: leads.filter((l) => l.status === "Followed Up").length },
    { id: "Qualified", label: "Qualified", count: leads.filter((l) => l.status === "Qualified").length },
    { id: "Converted", label: "Converted", count: leads.filter((l) => l.status === "Converted").length },
  ];

  return (
    <div className="space-y-6 font-sans text-left text-slate-900">
      
      {/* Header Bar - Compact AWS Enterprise Style */}
      <div className="bg-gradient-to-r from-[#EAF7F7]/70 via-white to-[#F0F6FF]/70 p-3.5 sm:p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10.5px] font-bold text-[#005B6E] tracking-wider uppercase">
              Inbound CRM
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500 font-medium">Verified Customer Inquiries</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950">
            Attendee Leads
          </h1>
          <p className="text-xs text-slate-600 font-medium">
            Manage executive leads captured at summits, scheduled demo walkthroughs, and specialist follow-ups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#005B6E]" />
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Compact Filter Tabs & Search Bar (AWS Console Style) */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-0.5 rounded-md bg-slate-100 border border-slate-200 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const isActive = statusFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setStatusFilter(t.id)}
                className={cn(
                  "h-7 px-2.5 rounded text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap",
                  isActive
                    ? "bg-[#005B6E] text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                )}
              >
                <span>{t.label}</span>
                <span className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded font-mono font-bold",
                  isActive ? "bg-[#004754] text-white" : "bg-slate-200 text-slate-700"
                )}>
                  {t.count}
                </span>
              </button>
            );
          })}
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

      {/* CRM Leads Table - Dense AWS Console Style */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-2 px-3">Customer &amp; Contact</th>
                <th className="py-2 px-3">Company</th>
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Pipeline Status</th>
                <th className="py-2 px-3">Assigned Specialist</th>
                <th className="py-2 px-3">Scheduled Demo</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <TableSkeleton rows={5} columns={6} hasAvatar={false} />
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setActiveLeadDrawerId(lead.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    {/* Visitor & Contact */}
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-950">
                        {lead.visitorName}
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        {lead.email} {lead.phone ? `• ${lead.phone}` : ""}
                      </div>
                    </td>

                    {/* Company */}
                    <td className="py-2 px-3 font-medium text-slate-700 whitespace-nowrap">
                      {lead.company || "Enterprise Corp"}
                    </td>

                    {/* Product Interest */}
                    <td className="py-2 px-3 whitespace-nowrap font-semibold text-[#005B6E] text-xs">
                      {lead.productInterested || "Bulkwave"}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={cn(
                          "text-[10.5px] font-semibold px-2 py-0.5 rounded border focus:outline-none cursor-pointer bg-white h-6.5",
                          lead.status === "Unread" && "text-slate-700 border-slate-300",
                          lead.status === "Qualified" && "text-[#005B6E] border-[#CEEFEF] bg-[#EAF7F7]",
                          lead.status === "Converted" && "text-emerald-800 border-emerald-300 bg-emerald-50",
                          lead.status === "Followed Up" && "text-amber-800 border-amber-300 bg-amber-50",
                          lead.status === "Closed" && "text-slate-500 border-slate-200 bg-slate-100"
                        )}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>

                    {/* Assigned Specialist (Interactive) */}
                    <td className="py-2 px-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.assignedProductOwnerId || "unassigned"}
                        onChange={async (e) => {
                          const selectedId = e.target.value;
                          const targetOwner = owners.find((o) => o.id === selectedId);
                          await updateLead(lead.id, {
                            assignedProductOwnerId: selectedId === "unassigned" ? null : selectedId,
                            assignedProductOwner: targetOwner ? targetOwner.name : "Unassigned",
                          });
                        }}
                        className={cn(
                          "text-[10.5px] font-medium px-2 py-0.5 rounded border focus:outline-none cursor-pointer bg-white transition-colors h-6.5",
                          !lead.assignedProductOwnerId || lead.assignedProductOwner === "Unassigned"
                            ? "text-slate-500 border-slate-300 hover:border-slate-400"
                            : "text-[#1E3A8A] border-[#D8E6FA] font-semibold bg-[#F0F6FF]"
                        )}
                      >
                        <option value="unassigned">Unassigned</option>
                        {owners.map((owner) => (
                          <option key={owner.id} value={owner.id}>
                            {owner.name} ({owner.role})
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Demo Schedule */}
                    <td className="py-2 px-3 text-[11px] text-slate-700 font-medium whitespace-nowrap">
                      {lead.bookingDate || lead.bookingTime ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#005B6E]" />
                          <span>{lead.bookingDate}</span>
                          <span className="text-slate-400 font-normal">{lead.bookingTime}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">General Inbound</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteLead(lead.id)}
                        title="Delete Lead"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No leads match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail Drawer (when a lead is clicked) */}
      {activeLeadDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-150"
          onClick={() => setActiveLeadDrawerId(null)}
        >
          <div
            className="w-full max-w-md bg-white h-full p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0090AD]">
                    Lead Record #{activeLeadDrawer.id.slice(0, 10)}
                  </span>
                  <h3 className="text-xl font-bold text-slate-950">{activeLeadDrawer.visitorName}</h3>
                </div>
                <button
                  onClick={() => setActiveLeadDrawerId(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Company / Organization</span>
                  <div className="font-bold text-slate-950 text-sm">{activeLeadDrawer.company}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Email</span>
                    <div className="text-slate-800 font-semibold">{activeLeadDrawer.email}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Phone</span>
                    <div className="text-slate-800 font-semibold">{activeLeadDrawer.phone || "N/A"}</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Product Solution</span>
                  <div className="font-bold text-[#0090AD] text-sm">{activeLeadDrawer.productInterested}</div>
                </div>

                {/* Scheduled Walkthrough Date & Time */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#F0F6FF] rounded-xl border border-[#D8E6FA]">
                  <div>
                    <span className="text-[#1E3A8A] uppercase text-[10px] font-bold block">Scheduled Date</span>
                    <span className="text-slate-900 font-bold text-xs mt-0.5 block">
                      {activeLeadDrawer.bookingDate || "Unscheduled"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#1E3A8A] uppercase text-[10px] font-bold block">Time Slot</span>
                    <span className="text-slate-900 font-bold text-xs mt-0.5 block">
                      {activeLeadDrawer.bookingTime || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Live Pipeline Status Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase text-[10px] font-bold block">
                    Pipeline Status
                  </label>
                  <select
                    value={activeLeadDrawer.status}
                    onChange={(e) => updateLeadStatus(activeLeadDrawer.id, e.target.value as LeadStatus)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0090AD] shadow-2xs cursor-pointer"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Live Assigned Specialist Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase text-[10px] font-bold block">
                    Assigned Lead Specialist
                  </label>
                  <select
                    value={activeLeadDrawer.assignedProductOwnerId || "unassigned"}
                    onChange={async (e) => {
                      const selectedId = e.target.value;
                      const targetOwner = owners.find((o) => o.id === selectedId);
                      await updateLead(activeLeadDrawer.id, {
                        assignedProductOwnerId: selectedId === "unassigned" ? null : selectedId,
                        assignedProductOwner: targetOwner ? targetOwner.name : "Unassigned",
                      });
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0090AD] shadow-2xs cursor-pointer"
                  >
                    <option value="unassigned">Unassigned (General Pool)</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} — {owner.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">Meeting Notes &amp; Brief</span>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-medium">
                    {activeLeadDrawer.notes || "No additional meeting notes provided."}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                FifthEvents Live CRM Record
              </span>
              <button
                onClick={() => setActiveLeadDrawerId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
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
