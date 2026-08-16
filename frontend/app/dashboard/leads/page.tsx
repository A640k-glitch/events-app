"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { Lead } from "@/lib/types";
import AddLeadModal from "@/components/modals/AddLeadModal";
import { 
  Users, 
  Search, 
  Download, 
  Plus, 
  Trash2, 
  Mail, 
  Calendar, 
  Building, 
  User, 
  Layers, 
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeadsPage() {
  const { leads, updateLeadStatus, deleteLead } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedLead = leads.find((l) => l.id === selectedLeadId);

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.productInterested.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCsv = () => {
    const headers = ["ID", "Name", "Email", "Company", "Product", "Owner", "Date", "Time", "Status"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.visitorName}"`,
      `"${l.email}"`,
      `"${l.company}"`,
      `"${l.productInterested}"`,
      `"${l.assignedProductOwner}"`,
      l.bookingDate,
      l.bookingTime,
      l.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FifthLab_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left">
        
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-heading">
                Leads Command Table
              </h1>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                AUTOMATED PIPELINE
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              Live incoming visitor demo requests captured from public portal with zero manual staff data entry.
            </p>
          </div>

          <div className="flex items-center gap-2 font-medium text-xs">
            <button
              onClick={exportCsv}
              className="px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Manual Lead</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/60 p-3 border border-white/10 backdrop-blur-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search leads by name, email, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500 text-xs text-white placeholder-white/40 pl-9 pr-3 py-2 outline-none font-light"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto text-xs overflow-x-auto pb-1 sm:pb-0 font-light">
            {["ALL", "Unread", "Followed Up", "Qualified", "Converted"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  "px-3 py-1.5 text-xs whitespace-nowrap transition-all cursor-pointer",
                  statusFilter === st
                    ? "bg-white text-black font-medium"
                    : "bg-white/5 text-white/70 border border-white/10 hover:text-white"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Data Density Table Box */}
        <div className="border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-light">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60 font-medium uppercase text-[10px] tracking-wider">
                  <th className="p-4">Visitor & Company</th>
                  <th className="p-4">Product Interested</th>
                  <th className="p-4">Assigned Owner</th>
                  <th className="p-4">Booking Date & Time</th>
                  <th className="p-4">Pipeline Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/40 text-xs font-light">
                      No leads found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((l) => (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedLeadId(l.id)}
                      className={cn(
                        "hover:bg-white/5 transition-colors cursor-pointer",
                        selectedLeadId === l.id && "bg-blue-950/20"
                      )}
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white text-xs">{l.visitorName}</span>
                          <span className="text-[11px] text-white/50">{l.company} • {l.email}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-blue-400">{l.productInterested}</td>
                      <td className="p-4 text-white/80">{l.assignedProductOwner}</td>
                      <td className="p-4 text-white/70">{l.bookingDate} at {l.bookingTime}</td>
                      <td className="p-4">
                        <span className={cn(
                          "text-[10px] font-medium uppercase tracking-wider",
                          l.status === "Unread" && "text-blue-400",
                          l.status === "Followed Up" && "text-emerald-400",
                          l.status === "Qualified" && "text-amber-400",
                          l.status === "Converted" && "text-purple-400"
                        )}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLead(l.id);
                          }}
                          className="p-1 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lead Detail Drawer / Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg border border-white/10 bg-[#0e1017] p-6 space-y-5 shadow-2xl relative text-left">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-lg font-normal text-white font-heading">{selectedLead.visitorName}</h3>
                  <p className="text-xs text-white/60 font-light">{selectedLead.company} • {selectedLead.email}</p>
                </div>
                <button onClick={() => setSelectedLeadId(null)} className="p-1 text-white/50 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs font-light">
                <div className="p-3 border border-white/5 bg-white/5 flex justify-between">
                  <span className="text-white/60">Product Requested:</span>
                  <span className="font-medium text-blue-400">{selectedLead.productInterested}</span>
                </div>
                <div className="p-3 border border-white/5 bg-white/5 flex justify-between">
                  <span className="text-white/60">Scheduled Owner:</span>
                  <span className="font-medium text-white">{selectedLead.assignedProductOwner}</span>
                </div>
                <div className="p-3 border border-white/5 bg-white/5 flex justify-between">
                  <span className="text-white/60">Meeting Date & Time:</span>
                  <span className="text-white">{selectedLead.bookingDate} @ {selectedLead.bookingTime}</span>
                </div>
                {selectedLead.notes && (
                  <div className="p-3 border border-white/5 bg-white/5 space-y-1">
                    <span className="text-white/60 block">Visitor Notes:</span>
                    <p className="text-white text-xs">{selectedLead.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-medium text-white block">Update Lead Status:</span>
                <div className="grid grid-cols-4 gap-2 text-xs font-medium">
                  {(["Unread", "Followed Up", "Qualified", "Converted"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateLeadStatus(selectedLead.id, st)}
                      className={cn(
                        "py-2 border transition-all cursor-pointer text-[10px] uppercase tracking-wider",
                        selectedLead.status === st
                          ? "bg-blue-600 text-white border-blue-500 shadow-md"
                          : "bg-white/5 text-white/60 border-white/10 hover:text-white"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      <AddLeadModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </DashboardLayout>
  );
}
