import Link from "next/link";
import { ArrowLeft, Calendar, Compass, Home } from "lucide-react";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between relative overflow-hidden font-sans select-none text-left">
      {/* Subtle Ambient Fingerprint Watermarks */}
      <FingerprintPattern
        size={700}
        opacity={0.04}
        className="absolute -right-36 -top-20 text-[#0090AD] rotate-45 pointer-events-none"
      />
      <FingerprintPattern
        size={600}
        opacity={0.03}
        className="absolute -left-36 -bottom-20 text-slate-900 -rotate-12 pointer-events-none"
      />

      {/* Top Header Bar */}
      <header className="px-6 py-6 border-b border-slate-200/80 bg-white/70 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <FifthEventsLogo size={24} theme="light" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to platform</span>
          </Link>
        </div>
      </header>

      {/* Center 404 Hero Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold tracking-wider uppercase">
            Error 404 • Resource Not Located
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-950 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
              The requested summit, pass verification, or administrative route does not exist or has been relocated within the dashboard.
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#0090AD]" />
              <span>Browse Summits</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Compass className="w-3.5 h-3.5 text-[#0090AD]" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="py-6 border-t border-slate-200/80 text-center text-xs text-slate-500 font-mono relative z-10">
        FifthEvents • Co-engineered by The FifthLab &amp; CWG PLC
      </footer>
    </div>
  );
}
