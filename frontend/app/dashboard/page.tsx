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

export default function DashboardOverviewPage() {
  const { events, leads, pitches, approvePitch, declinePitch } = useApp();
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
        
        {/* 1. Header Area with Structured Layout & High-Contrast Styling */}
        <motion.div 
          variants={itemVariants} 
          className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl">
              Track your events, check who is on duty, and follow up with summit leads.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsAddEventOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
            >
              <Plus className="w-3.5 h-3.5 text-[#0090AD]" />
              <span>Create Event</span>
            </button>

            <button
              onClick={() => setIsAddLeadOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs font-bold shadow-md shadow-[#0090AD]/20 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Log Lead</span>
            </button>
          </div>
        </motion.div>

        {/* 2. Dual Hero Action Cards with Cohesive FifthEvents Palette */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Hero Card: YOUR TEAM */}
          <div className="lg:col-span-8 rounded-2xl border border-[#20B2AA]/30 bg-gradient-to-br from-[#F2FAFB] via-white to-[#F6FCFD] p-6 sm:p-7 flex flex-col justify-between space-y-5 relative overflow-hidden shadow-2xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00829B] font-mono flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> TEAM ROSTER
                </span>
                <Link
                  href="/dashboard/team"
                  className="text-xs font-bold text-[#0090AD] hover:text-[#007A94] flex items-center gap-1 group"
                >
                  <span>View Team Directory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Staff your booths and sessions
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Add team members to event rosters so visitors can connect directly with the engineer or product manager behind each solution.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Link
                href="/dashboard/team"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <span>Invite your team</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Hero Card: HELP CENTER */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 flex flex-col justify-between space-y-4 relative overflow-hidden shadow-2xs">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                GUIDES
              </span>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                Event guides &amp; FAQs
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                Quick guides on badge scanning, digital pass issuance, and exporting leads to your CRM.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard/events"
                className="text-xs font-bold text-[#0090AD] hover:text-[#007A94] flex items-center gap-1 group"
              >
                <span>Read guides</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </motion.div>

        {/* 3. Pending Proposal Alert Banner (if any) */}
        {pendingPitches.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-2xl border border-amber-300 bg-amber-50/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs"
          >
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Inbox className="w-4 h-4 text-amber-700" /> Pending Organizer Proposal ({pendingPitches.length})
              </span>
              <p className="text-xs text-amber-950 font-medium">
                {pendingPitches[0].organizerName} from <strong>{pendingPitches[0].organization}</strong> submitted a proposal for &quot;{pendingPitches[0].eventTitle}&quot; in {pendingPitches[0].proposedCity}.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => approvePitch(pendingPitches[0].id, true, "Approved via Admin Center")}
                className="px-4 py-1.5 rounded-xl bg-[#0090AD] text-white text-xs font-bold hover:bg-[#007A94] transition-colors cursor-pointer shadow-xs"
              >
                Approve
              </button>
              <button
                onClick={() => declinePitch(pendingPitches[0].id, "Declined")}
                className="px-3.5 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Decline
              </button>
            </div>
          </motion.div>
        )}

        {/* 4. Activity Metrics Row with Clean Contrast & Consistent Accents */}
        <motion.div variants={itemVariants} className="space-y-3">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono">
              LAST 30 DAYS
            </span>
            <Link
              href="/dashboard/events"
              className="text-xs font-bold text-[#0090AD] hover:text-[#007A94] flex items-center gap-1"
            >
              View Analytics <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric 1: Created Events (Kuleanpay Ice-Blue Tint) */}
            <div className="p-5 rounded-2xl border border-[#D8E6FA] bg-[#F0F6FF] space-y-1.5 shadow-2xs hover:border-[#2563EB]/40 transition-colors">
              <span className="text-xs font-semibold text-slate-600 block">Active events</span>
              <div className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-mono">
                {events.length}
              </div>
              <div className="text-xs text-slate-500">
                Summits and workshops scheduled
              </div>
              <div className="pt-1 flex items-center gap-1 text-[11px] text-[#2563EB] font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12% this month</span>
              </div>
            </div>

            {/* Metric 2: Inbound Leads (Finedge Aqua-Mint Tint) */}
            <div className="p-5 rounded-2xl border border-[#CEEFEF] bg-[#EAF7F7] space-y-1.5 shadow-2xs hover:border-[#0090AD]/40 transition-colors">
              <span className="text-xs font-semibold text-slate-600 block">Inbound leads</span>
              <div className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-mono">
                {leads.length}
              </div>
              <div className="text-xs text-slate-500">
                Booth inquiries and demo requests
              </div>
              <div className="pt-1 flex items-center gap-1 text-[#0090AD] font-semibold text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% conversion</span>
              </div>
            </div>

            {/* Metric 3: Door Check-ins (Bulkwave Periwinkle Tint) */}
            <div className="p-5 rounded-2xl border border-[#E0E4FB] bg-[#F3F4FD] space-y-1.5 shadow-2xs hover:border-[#4F46E5]/40 transition-colors">
              <span className="text-xs font-semibold text-slate-600 block">Checked-in rate</span>
              <div className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight font-mono">
                98.4%
              </div>
              <div className="text-xs text-slate-500">
                Attendees verified with digital QR
              </div>
              <div className="pt-1 flex items-center gap-1 text-[#4F46E5] font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sub-second door scan</span>
              </div>
            </div>

          </div>

        </motion.div>

        {/* 5. Data Pipelines: High-Contrast CRM Table + Upcoming Summits */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left: Leads CRM Table (8 Cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-2xs text-left">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Inbound Leads
                </h2>
                <p className="text-xs text-slate-500">
                  Latest summit visitors and demo inquiries routed to product owners.
                </p>
              </div>

              <Link
                href="/dashboard/leads"
                className="text-xs font-bold text-[#0090AD] hover:text-[#007A94] flex items-center gap-1 group"
              >
                <span>View all ({leads.length})</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-2.5 px-3">Visitor &amp; Contact</th>
                    <th className="py-2.5 px-3">Company</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Specialist</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/90 transition-colors">
                      {/* Visitor */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 truncate max-w-[140px]">
                          {lead.visitorName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {lead.email}
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-2.5 px-3 font-medium text-slate-700 truncate max-w-[120px]">
                        {lead.company || "Enterprise Corp"}
                      </td>

                      {/* Product */}
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 text-[11px] font-mono font-medium border border-slate-200/80">
                          {lead.productInterested || "Bulkwave"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <span className={cn(
                          "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                          lead.status === "Unread" && "bg-slate-100 text-slate-700 border-slate-200",
                          lead.status === "Qualified" && "bg-[#E8F8FA] text-[#00829B] border-[#20B2AA]/30",
                          lead.status === "Converted" && "bg-emerald-50 text-emerald-800 border-emerald-200",
                          lead.status === "Followed Up" && "bg-amber-50 text-amber-800 border-amber-200",
                          lead.status === "Closed" && "bg-slate-100 text-slate-500 border-slate-200"
                        )}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 font-medium truncate max-w-[100px]">
                        {lead.assignedProductOwner || "Product Specialist"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Upcoming Summits (4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-2xs text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Upcoming Summits
                </h2>
                <p className="text-xs text-slate-500 font-medium">Active schedules & venues</p>
              </div>

              <Link
                href="/dashboard/events"
                className="text-xs font-bold text-[#0090AD] hover:text-[#007A94] flex items-center gap-1 group"
              >
                <span>All events</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/80 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">
                      {evt.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-semibold shrink-0">
                      {evt.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                    <span>{evt.city} • {evt.date}</span>
                    <span className="text-[#00829B] font-bold font-mono">{evt.expectedAttendance} RSVPs</span>
                  </div>
                </div>
              ))}
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
