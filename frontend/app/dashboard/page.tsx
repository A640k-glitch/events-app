"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { CalendarDays, Users, TrendingUp, Layers, ArrowUpRight, CheckCircle2, Ticket, Sparkles, Inbox } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { events, leads, stats, pitches, approvePitch, declinePitch } = useApp();

  const pendingPitches = pitches.filter((p) => p.status === "SUBMITTED");

  return (
    <DashboardLayout>
      <div className="space-y-6 font-sans text-left">
        
        {/* Header Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-white font-heading">
                Organizer Command Hub
              </h1>
              <span className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                NEON POSTGRESQL LIVE
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1 font-light">
              FifthLab Operations Matrix • Event Publishing, Staff Manifests & Visitor Pipeline
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/events"
              className="px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
              <span>Events Catalog</span>
            </Link>

            <Link
              href="/dashboard/leads"
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Users className="w-3.5 h-3.5" />
              <span>View Ingested Leads</span>
            </Link>
          </div>
        </div>

        {/* Pending Pitch Review Alert (If Any Organizer Proposes Events) */}
        {pendingPitches.length > 0 && (
          <div className="p-4 border border-cyan-500/30 bg-cyan-950/20 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Inbox className="w-4 h-4" /> Pending Pro Organizer Pitches ({pendingPitches.length})
              </span>
              <p className="text-xs text-white/80 font-light">
                {pendingPitches[0].organizerName} from <strong className="text-white">{pendingPitches[0].organization}</strong> proposed "{pendingPitches[0].eventTitle}" in {pendingPitches[0].proposedCity}.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs font-medium">
              <button
                type="button"
                onClick={() => approvePitch(pendingPitches[0].id, true)}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer transition-all shadow-md"
              >
                Approve & Publish to Homepage
              </button>
              <button
                type="button"
                onClick={() => declinePitch(pendingPitches[0].id)}
                className="px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-all"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {/* 100% Live Dynamic KPI Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Published Events */}
          <div className="border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Upcoming Events
              </span>
              <div className="w-8 h-8 bg-white/5 text-cyan-400 flex items-center justify-center border border-white/10">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-normal text-white font-heading">
                {stats.upcomingEventsCount}
              </span>
              <span className="text-xs text-cyan-400 flex items-center gap-0.5 font-light">
                {stats.totalExpectedAttendance.toLocaleString()} Total Pipeline Seats
              </span>
            </div>
            <p className="text-xs text-white/50 font-light">Internal attendance tracking live</p>
          </div>

          {/* Card 2: Ingested Demo Leads */}
          <div className="border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Demo Requests
              </span>
              <div className="w-8 h-8 bg-white/5 text-cyan-400 flex items-center justify-center border border-white/10">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-normal text-white font-heading">
                {stats.demoRequestsCount}
              </span>
              <span className="text-xs text-cyan-400 flex items-center gap-0.5 font-light">
                {stats.unreadLeadsCount} Unread
              </span>
            </div>
            <p className="text-xs text-white/50 font-light">Zero manual staff entry required</p>
          </div>

          {/* Card 3: Public Registrations & Proposals */}
          <div className="border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Public Registrations
              </span>
              <div className="w-8 h-8 bg-white/5 text-cyan-400 flex items-center justify-center border border-white/10">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-normal text-white font-heading">
                {stats.publicRegistrationsCount}
              </span>
              <span className="text-xs text-cyan-400 flex items-center gap-0.5 font-light">
                {stats.pendingPitchesCount} Proposals Pending
              </span>
            </div>
            <p className="text-xs text-white/50 font-light">Instant digital QR pass issuance</p>
          </div>

          {/* Card 4: Active Corporate Staff */}
          <div className="border border-white/10 bg-black/60 backdrop-blur-xl p-5 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Active Staff
              </span>
              <div className="w-8 h-8 bg-white/5 text-cyan-400 flex items-center justify-center border border-white/10">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-3xl font-normal text-white font-heading">
                {stats.activeStaffCount}
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-0.5 font-light">
                @thefifthlab.com Roster
              </span>
            </div>
            <p className="text-xs text-white/50 font-light">Deployment manifest active</p>
          </div>
        </div>

        {/* Main Content Grid: Industry Events + Recent Demo Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Upcoming Industry Events */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-cyan-400" />
                <span>Live Published Events ({events.length})</span>
              </h3>
              <Link href="/dashboard/events" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                Manage Events <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="p-8 border border-white/10 bg-black/60 text-center text-xs text-white/40 font-light">
                  No events published yet. Click "Events Catalog" to create your first event.
                </div>
              ) : (
                events.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="border border-white/10 bg-black/60 backdrop-blur-xl p-4 space-y-3 hover:border-white/20 transition-all text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                          {evt.category} • {evt.location}
                        </span>
                        <h4 className="text-sm font-medium text-white mt-0.5 font-heading">{evt.title}</h4>
                        <p className="text-xs text-white/60 line-clamp-2 mt-1 font-light">{evt.description}</p>
                      </div>
                      <span className="text-xs text-cyan-400 bg-cyan-950/40 px-2.5 py-1 border border-cyan-500/30 shrink-0 font-light">
                        {evt.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/60 font-light">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Staff RSVP: <strong className="text-white">{evt.confirmedStaffCount} confirmed</strong></span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Live Sync
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Recent Public Demo Bookings */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Recent Ingested Leads ({leads.length})</span>
              </h3>
              <Link href="/dashboard/leads" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {leads.length === 0 ? (
                <div className="p-8 border border-white/10 bg-black/60 text-center text-xs text-white/40 font-light">
                  No visitor demo requests captured yet.
                </div>
              ) : (
                leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    className="border border-white/10 bg-black/60 backdrop-blur-xl p-3.5 flex items-center justify-between gap-3 hover:border-white/20 transition-all text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-medium text-white truncate">{lead.visitorName}</h4>
                        <span className="text-[10px] text-white/50 truncate">({lead.company})</span>
                      </div>
                      <p className="text-[11px] text-white/60 truncate mt-0.5 font-light">
                        Product: <span className="text-cyan-400">{lead.productInterested}</span>
                      </p>
                    </div>

                    <span className={cn(
                      "text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 border shrink-0",
                      lead.status === "Unread" && "bg-cyan-950/40 text-cyan-400 border-cyan-500/30",
                      lead.status === "Followed Up" && "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
                      lead.status === "Qualified" && "bg-amber-950/40 text-amber-400 border-amber-500/30",
                      lead.status === "Converted" && "bg-purple-950/40 text-purple-400 border-purple-500/30"
                    )}>
                      {lead.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
