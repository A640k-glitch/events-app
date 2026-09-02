"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Lead, LeadStatus } from "@/lib/types";
import AddLeadModal from "@/components/modals/AddLeadModal";
import { 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
  const { leads, updateLeadStatus, deleteLead } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeLeadDrawer, setActiveLeadDrawer] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

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
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left text-slate-900">
        
        {/* Header Bar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Attendee Leads & CRM Pipeline
              </h1>
              <span className="text-[11px] text-[#0090AD] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F8FA] border border-[#20B2AA]/20 font-mono">
                {leads.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Delegates, enterprise buyers, and booth visitors routed to product engineering specialists.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={exportCsv}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-[#0090AD]" />
              <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs font-bold shadow-md shadow-[#0090AD]/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Inbound Lead</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search Container */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 overflow-x-auto no-scrollbar shadow-2xs">
            {tabs.map((t) => {
              const isActive = statusFilter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setStatusFilter(t.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap",
                    isActive
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  )}
                >
                  <span>{t.label}</span>
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded-full",
                    isActive ? "bg-[#E8F8FA] text-[#0090AD] font-bold" : "bg-slate-200 text-slate-600 font-medium"
                  )}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0090AD] shadow-2xs"
            />
          </div>
        </div>

        {/* CRM Leads Table */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-[#8E8EA0] uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-4">Visitor & Contact</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Product Interest</th>
                  <th className="py-3 px-4">Status Pipeline</th>
                  <th className="py-3 px-4">Assigned Specialist</th>
                  <th className="py-3 px-4">Demo Schedule</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setActiveLeadDrawer(lead)}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      {/* Visitor & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#111827]">
                          {lead.visitorName}
                        </div>
                        <div className="text-[11px] text-[#6B7280]">
                          {lead.email} • {lead.phone}
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-4 font-medium text-[#374151]">
                        {lead.company || "Enterprise"}
                      </td>

                      {/* Product Interest */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-gray-100 text-[#111827] text-[11px] font-mono font-medium">
                          {lead.productInterested || "Bulkwave"}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className={cn(
                            "text-[11px] font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer",
                            lead.status === "Unread" && "bg-gray-50 border-gray-200 text-gray-700",
                            lead.status === "Qualified" && "bg-[#E8F8FA] border-[#20B2AA]/30 text-[#00829B]",
                            lead.status === "Converted" && "bg-emerald-50 border-emerald-200 text-emerald-800",
                            lead.status === "Followed Up" && "bg-amber-50 border-amber-200 text-amber-800",
                            lead.status === "Closed" && "bg-gray-100 border-gray-200 text-gray-500"
                          )}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>

                      {/* Assigned Specialist */}
                      <td className="py-3.5 px-4 text-[11px] text-[#4B5563]">
                        {lead.assignedProductOwner || "Product Specialist"}
                      </td>

                      {/* Demo Schedule */}
                      <td className="py-3.5 px-4 text-[11px] text-[#6B7280] font-mono">
                        {lead.bookingDate} {lead.bookingTime}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          title="Delete Lead"
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
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
            onClick={() => setActiveLeadDrawer(null)}
          >
            <div
              className="w-full max-w-md bg-white h-full p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0090AD] font-mono">
                      Lead Record #{activeLeadDrawer.id.slice(0, 8)}
                    </span>
                    <h3 className="text-xl font-bold text-[#111827]">{activeLeadDrawer.visitorName}</h3>
                  </div>
                  <button
                    onClick={() => setActiveLeadDrawer(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase text-[10px] font-semibold">Company</span>
                    <div className="font-semibold text-[#111827] text-sm">{activeLeadDrawer.company}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-gray-400 uppercase text-[10px] font-semibold">Email</span>
                      <div className="text-gray-800 font-medium">{activeLeadDrawer.email}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 uppercase text-[10px] font-semibold">Phone</span>
                      <div className="text-gray-800 font-medium">{activeLeadDrawer.phone || "N/A"}</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase text-[10px] font-semibold">Product Requested</span>
                    <div className="font-mono text-[#0090AD] font-semibold">{activeLeadDrawer.productInterested}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-gray-400 uppercase text-[10px] font-semibold">Meeting Notes & Brief</span>
                    <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 leading-relaxed">
                      {activeLeadDrawer.notes || "No additional meeting notes provided."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono">
                  Recorded via FifthEvents Engine
                </span>
                <button
                  onClick={() => setActiveLeadDrawer(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl"
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
    </DashboardLayout>
  );
}
