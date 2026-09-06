"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { motion, Variants } from "framer-motion";
import { 
  Inbox, 
  Plus, 
  ArrowRight, 
  UserPlus, 
  ChevronRight,
  Users,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import AddLeadModal from "@/components/modals/AddLeadModal";
import AddEventModal from "@/components/modals/AddEventModal";
import { StatsRowSkeleton, TableSkeleton } from "@/components/ui/SkeletonLoaders";

const categoryColorMap: Record<string, { text: string }> = {
  Conference: { text: "text-[#005B6E]" },
  Summit: { text: "text-[#4F46E5]" },
  Workshop: { text: "text-[#D97706]" },
  Webinar: { text: "text-[#059669]" },
  Exhibition: { text: "text-[#7C3AED]" },
};

export default function DashboardOverviewPage() {
  const { events, leads, pitches, approvePitch, declinePitch, isLoading, stats } = useApp();
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const pendingPitches = pitches.filter((p) => p.status === "SUBMITTED");
  const recentLeads = leads.slice(0, 6);
  const upcomingEvents = events.slice(0, 4);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 font-sans text-left text-slate-900"
      >
        
        {/* 1. Header Area - Compact AWS Enterprise Style */}
        <motion.div 
          variants={itemVariants} 
          className="bg-gradient-to-r from-[#EAF7F7]/70 via-white to-[#F0F6FF]/70 p-3.5 sm:p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-600 font-medium max-w-2xl">
              Manage your upcoming events, check booth staff rosters, and follow up with attendees.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#005B6E] shrink-0" />
              <span>Create Event</span>
            </button>

            <button
              onClick={() => setIsAddLeadOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-md bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span>Add Lead</span>
            </button>
          </div>
        </motion.div>

        {/* 2. Pending Proposal Alert Banner (if any) */}
        {pendingPitches.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="p-3 rounded-lg border border-amber-300 bg-amber-50/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs"
          >
            <div className="space-y-0.5 text-left">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Inbox className="w-3.5 h-3.5 text-amber-700" /> Pending Organizer Proposal ({pendingPitches.length})
              </span>
              <p className="text-xs text-amber-950 font-medium">
                {pendingPitches[0].organizerName} from <strong>{pendingPitches[0].organization}</strong> submitted a proposal for &quot;{pendingPitches[0].eventTitle}&quot; in {pendingPitches[0].proposedCity}.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => approvePitch(pendingPitches[0].id, true, "Approved via Admin Center")}
                className="h-7 px-3 rounded-md bg-[#005B6E] text-white text-xs font-semibold hover:bg-[#004754] transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => declinePitch(pendingPitches[0].id, "Declined")}
                className="h-7 px-2.5 rounded-md border border-amber-300 bg-white text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Decline
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. Live Database Telemetry Metrics - Colored Brand Cards with Top Accent Borders */}
        <motion.div variants={itemVariants} className="space-y-2.5">
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
              LIVE SYSTEM TELEMETRY
            </span>
            <Link
              href="/dashboard/events"
              className="text-xs font-semibold text-[#005B6E] hover:underline flex items-center gap-1"
            >
              View Events <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <StatsRowSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Metric 1: Active Events in DB */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Events</span>
              <div className="text-2xl font-bold text-slate-950 tracking-tight">
                {events.length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Summits &amp; conferences scheduled
              </div>
              <div className="pt-0.5 flex items-center gap-1 text-[11px] text-[#005B6E] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{events.filter((e) => e.isFifthLabAttending).length} active exhibitions</span>
              </div>
            </div>

            {/* Metric 2: Inbound Leads from DB */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Demo Inquiries &amp; Leads</span>
              <div className="text-2xl font-bold text-slate-950 tracking-tight">
                {leads.length}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Prospect inquiries from demo form
              </div>
              <div className="pt-0.5 flex items-center gap-1 text-[#005B6E] font-medium text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stats.unreadLeadsCount} unread inquiries</span>
              </div>
            </div>

            {/* Metric 3: Real QR Door Check-ins from DB */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Verified Check-in Rate</span>
              <div className="text-2xl font-bold text-slate-950 tracking-tight">
                {stats.publicRegistrationsCount > 0 
                  ? `${Math.round(((stats.checkedInCount || 0) / stats.publicRegistrationsCount) * 100)}%` 
                  : "0%"}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {stats.checkedInCount || 0} checked in of {stats.publicRegistrationsCount} registered
              </div>
              <div className="pt-0.5 flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Real-time digital pass verification</span>
              </div>
            </div>

          </div>
        )}
        </motion.div>

        {/* 5. Data Pipelines: Dense AWS CRM Table + Upcoming Summits */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Left: Leads CRM Table (8 Cols) */}
          <div className="lg:col-span-8 rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Inbound Inquiries
                </h2>
                <p className="text-xs text-slate-500">
                  Latest attendee inquiries and scheduled product walkthroughs.
                </p>
              </div>

              <Link
                href="/dashboard/leads"
                className="text-xs font-semibold text-[#005B6E] hover:underline flex items-center gap-1 group"
              >
                <span>View all ({leads.length})</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-100/90 text-slate-800 uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-2.5 px-3">Visitor &amp; Contact</th>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <TableSkeleton rows={4} columns={5} hasAvatar={false} />
                      </td>
                    </tr>
                  ) : recentLeads.length > 0 ? (
                    recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      {/* Visitor */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0 uppercase">
                            {lead.visitorName ? lead.visitorName.slice(0, 2) : "VI"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                              {lead.visitorName}
                            </div>
                            <div className="text-[10.5px] text-slate-500 truncate max-w-[150px]">
                              {lead.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                        {lead.company || "Enterprise Corp"}
                      </td>

                      {/* Product */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-bold text-[#005B6E] text-xs">
                          {lead.productInterested || "Bulkwave"}
                        </span>
                      </td>

                      {/* Status (Clean indicator dot, no pill) */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                          <span className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            lead.status === "Unread" && "bg-slate-400",
                            lead.status === "Qualified" && "bg-[#005B6E]",
                            lead.status === "Converted" && "bg-emerald-600",
                            lead.status === "Followed Up" && "bg-amber-500",
                            lead.status === "Closed" && "bg-slate-500"
                          )} />
                          <span>{lead.status}</span>
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
                          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0 uppercase">
                            {lead.assignedProductOwner ? lead.assignedProductOwner.charAt(0) : "P"}
                          </div>
                          <span>{lead.assignedProductOwner || "Unassigned"}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No inquiries yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Upcoming Events (4 Cols) - Clean AWS Style with Subtle Brand Accents */}
          <div className="lg:col-span-4 rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 space-y-3 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Upcoming Events
                </h2>
                <p className="text-xs text-slate-500 font-medium">Next events on calendar</p>
              </div>

              <Link
                href="/dashboard/events"
                className="text-xs font-semibold text-[#005B6E] hover:underline flex items-center gap-1 group"
              >
                <span>All events</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-2">
              {upcomingEvents.map((evt) => {
                const color = categoryColorMap[evt.category] || { border: "border-slate-200", text: "text-slate-600" };
                return (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-gradient-to-r from-[#EAF7F7]/30 to-white hover:border-[#005B6E]/40 hover:bg-[#EAF7F7]/50 transition-all space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">
                        {evt.title}
                      </span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider shrink-0", color.text)}>
                        {evt.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                      <span>{evt.city} • {evt.date}</span>
                      <span className="text-emerald-700 font-semibold">{evt.time || "Scheduled"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>

        {/* Modals */}
        <AddLeadModal
          isOpen={isAddLeadOpen}
          onClose={() => setIsAddLeadOpen(false)}
        />

        <AddEventModal
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
        />

      </motion.div>
    </DashboardLayout>
  );
}
