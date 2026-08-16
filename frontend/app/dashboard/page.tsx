"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { MOCK_KPI } from "@/lib/mock-data";
import { CalendarDays, Users, TrendingUp, Layers, ArrowUpRight, CheckCircle2, Ticket, DollarSign } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { events, leads } = useApp();

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans">
        
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Command Center Overview
              </h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full font-bold">
                REAL-TIME TELEMETRY
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              FifthLab Nexus operations matrix • Internal Event Discovery & Lead Acquisition
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/events"
              className="px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Events Catalog</span>
            </Link>

            <Link
              href="/dashboard/leads"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-all flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>View Leads</span>
            </Link>
          </div>
        </div>

        {/* Warm Cream Contrast Summary Banner with Geometric Lines & Backdrop Blur */}
        <div className="border border-black/15 bg-[#faf8f5]/90 backdrop-blur-xl text-[#090a0f] p-6 relative overflow-hidden bg-geometric-lines shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <div className="space-y-1">
            <p className="text-xs text-blue-700 font-semibold tracking-wider uppercase">
              FIFTHLAB NIGERIA & CWG PLC ECOSYSTEM
            </p>
            <h2 className="text-xl font-normal text-[#090a0f] tracking-tight font-heading">
              West Africa Tech Event Operations Matrix
            </h2>
            <p className="text-xs text-[#334155] font-light">
              Real-time attendance manifests for Texcellence 2026, FifthLab Fintech Africa, and CWG PLC summits.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-xs font-light">
            <span className="text-[#334155]">Standard: <strong className="text-[#090a0f] font-medium">WAT (UTC+1)</strong></span>
            <span>•</span>
            <span className="text-[#334155]">Currency: <strong className="text-[#090a0f] font-medium">NGN (₦)</strong></span>
          </div>
        </div>

        {/* Clean Monochrome Architectural KPI Cards Grid (No Color Accents) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="arch-card p-5 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                Upcoming Events
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/15">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-extrabold text-white font-heading">
                {events.length}
              </span>
              <span className="text-xs font-bold text-white/80 flex items-center gap-0.5 font-mono">
                +3 this month <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-white/50">Internal attendance tracking live</p>
          </div>

          <div className="arch-card p-5 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                Demo Requests
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/15">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-extrabold text-white font-heading">
                {leads.length}
              </span>
              <span className="text-xs font-bold text-white/80 flex items-center gap-0.5 font-mono">
                +14.8% vs prev <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <p className="text-xs text-white/50">Zero manual staff entry required</p>
          </div>

          <div className="arch-card p-5 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                Pipeline Value
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/15">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-extrabold text-white font-heading">
                ₦28.5M
              </span>
              <span className="text-xs font-bold text-white/80 flex items-center gap-0.5 font-mono">
                5 Enterprise Deals
              </span>
            </div>
            <p className="text-xs text-white/50">FifthLab & CWG PLC products</p>
          </div>

          <div className="arch-card p-5 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider font-mono">
                Active Staff
              </span>
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/15">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-extrabold text-white font-heading">
                18
              </span>
              <span className="text-xs font-bold text-white/80 flex items-center gap-0.5 font-mono">
                100% Confirmed
              </span>
            </div>
            <p className="text-xs text-white/50">Deployment manifest active</p>
          </div>
        </div>

        {/* Main Content Grid: Industry Events + Recent Demo Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Upcoming Industry Events */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-400" />
                <span>Upcoming Industry Events (Internal)</span>
              </h3>
              <Link href="/dashboard/events" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {events.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-4 space-y-3 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
                        {evt.category} • {evt.location}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{evt.title}</h4>
                      <p className="text-xs text-white/60 line-clamp-2 mt-1">{evt.description}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/30 shrink-0">
                      {evt.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/60">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>FifthLab Confirmed: <strong className="text-white">{evt.confirmedStaffCount} staff</strong></span>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tracking Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recent Public Demo Bookings */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Recent Demo Bookings (Leads)</span>
              </h3>
              <Link href="/dashboard/leads" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                Command Center <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-3.5 flex items-center justify-between gap-3 hover:border-white/20 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{lead.visitorName}</h4>
                      <span className="text-[10px] text-white/50 truncate">({lead.company})</span>
                    </div>
                    <p className="text-[11px] text-white/60 truncate mt-0.5">
                      Product: <span className="text-blue-400">{lead.productInterested}</span>
                    </p>
                  </div>

                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0",
                    lead.status === "Unread" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                    lead.status === "Followed Up" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                    lead.status === "Qualified" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
                    lead.status === "Converted" && "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  )}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
