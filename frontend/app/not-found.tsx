import Link from "next/link";
import { ArrowLeft, Calendar, Compass, Home, Search, ShieldAlert, ChevronRight } from "lucide-react";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none text-left">
      {/* Ambient Lighting & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0090AD]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#111C4E]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Ambient Fingerprint Watermarks */}
      <FingerprintPattern
        size={740}
        opacity={0.04}
        className="absolute -right-40 -top-24 text-[#0090AD] rotate-45 pointer-events-none"
      />
      <FingerprintPattern
        size={600}
        opacity={0.03}
        className="absolute -left-36 -bottom-20 text-white -rotate-12 pointer-events-none"
      />

      {/* Top Header Bar */}
      <header className="px-6 py-5 border-b border-white/10 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <FifthEventsLogo size={24} theme="dark" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Platform</span>
          </Link>
        </div>
      </header>

      {/* Center 404 Hero Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-lg w-full text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-[#0090AD] text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>HTTP 404 • Resource Not Located</span>
          </div>

          {/* Big Impressive 404 Watermark Typography */}
          <div className="space-y-2">
            <div className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-600 font-mono">
              404
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Route Does Not Exist
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              The requested summit agenda, pass verification link, or administrative URL has been relocated or is not registered in our routing tables.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-semibold shadow-md transition-all whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-[#0090AD]" />
              <span>Browse Summits</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-[#0090AD]" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Quick Helpful Navigation Matrix */}
          <div className="pt-4 border-t border-white/10 text-left bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
              Suggested Destinations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <Link
                href="/products"
                className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <span>Enterprise Product Suite</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </Link>
              <Link
                href="/demo"
                className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <span>Book a Live Solution Demo</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Meta */}
      <footer className="py-5 border-t border-white/10 text-center text-xs text-slate-500 font-mono relative z-10">
        FifthEvents • Co-engineered by The FifthLab &amp; CWG PLC
      </footer>
    </div>
  );
}

