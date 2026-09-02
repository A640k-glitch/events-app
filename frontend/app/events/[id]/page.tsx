"use client";

import { use, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Building,
  User,
  Share2,
  Ticket,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { BrandButton } from "@/components/ui/BrandButtons";
import RegisterPassModal from "@/components/modals/RegisterPassModal";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { events, user, toggleAttendance } = useApp();
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const event = events.find((e) => e.id === resolvedParams.id) || events[0];

  if (!event) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#111827]">Event Not Found</h2>
        <p className="text-xs text-[#6B7280] mt-2 mb-6">The requested summit or conference does not exist.</p>
        <Link href="/events">
          <BrandButton variant="primary" size="sm">
            Back to Events
          </BrandButton>
        </Link>
      </div>
    );
  }

  const userRsvp = user && event.attendanceManifest
    ? event.attendanceManifest.find((m) => m.userId === user.id)?.status
    : null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-[#111827] flex flex-col justify-between font-sans">
      
      {/* Top Breadcrumbs & Title */}
      <section className="pt-32 sm:pt-36 pb-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto space-y-4 text-left">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <Link href="/events" className="hover:text-[#111827] flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Events
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-[#111827] font-medium truncate max-w-xs">{event.title}</span>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-gray-400" />
              <span>{copiedLink ? "Link Copied!" : "Share Event"}</span>
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded bg-gray-100 text-gray-700">
                {event.category}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                WAT Sync Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight">
              {event.title}
            </h1>
          </div>

        </div>
      </section>

      {/* Main Content Split Layout */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Column: Details, Agenda, Manifest (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overview Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 space-y-4">
              <h2 className="text-base font-semibold text-[#111827]">About the Event</h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                {event.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs">
                <div className="space-y-1">
                  <span className="text-gray-400 font-medium">Date & Schedule</span>
                  <div className="text-[#111827] font-semibold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#00B4D8]" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-gray-400 font-medium">Venue & Location</span>
                  <div className="text-[#111827] font-semibold flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#00B4D8]" />
                    <span>{event.location}, {event.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Manifest Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-semibold text-[#111827]">FifthLab Delegation</h2>
                  <p className="text-xs text-gray-500">Confirmed engineering and product specialists attending this summit.</p>
                </div>
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-700">
                  {event.attendanceManifest?.length || 0} Staff
                </span>
              </div>

              {/* Staff RSVP Toggle if logged in */}
              {user && (
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-xs font-semibold text-[#111827] block">Your Staff RSVP Status</span>
                  <div className="flex items-center gap-2">
                    {["Attending", "Maybe", "Declined"].map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleAttendance(event.id, status as any)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                          userRsvp === status
                            ? "bg-[#111827] text-white font-semibold shadow-xs"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(event.attendanceManifest || []).map((staff, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-gray-100 bg-[#FAFAFA] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-[#111827]">{staff.userName}</div>
                      <div className="text-[11px] text-gray-500">{staff.userRole}</div>
                    </div>
                    <span className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded font-medium",
                      staff.status === "Attending" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    )}>
                      {staff.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Pass Registration & Demo Scheduler (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Registration Card */}
            <div className="rounded-xl border-2 border-[#00B4D8] bg-white p-6 space-y-5 shadow-xs sticky top-24">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#0090AD] uppercase font-mono">
                  Public Pass
                </span>
                <h3 className="text-xl font-semibold text-[#111827]">Claim Digital Pass</h3>
                <p className="text-xs text-[#6B7280]">
                  Sub-second QR badge delivered directly to your corporate inbox.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                <BrandButton
                  variant="primary"
                  size="md"
                  className="w-full text-xs font-semibold"
                  onClick={() => setIsPassModalOpen(true)}
                >
                  Register Free Visitor Pass
                </BrandButton>

                <Link href={`/demo?product=bulkwave`}>
                  <BrandButton
                    variant="outline"
                    size="md"
                    className="w-full text-xs"
                  >
                    Schedule 1-on-1 Demo
                  </BrandButton>
                </Link>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NDPR & GDPR Compliant</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <RegisterPassModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        initialEventId={event.id}
      />

    </div>
  );
}
