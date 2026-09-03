"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[System Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between relative overflow-hidden font-sans select-none text-left">
      {/* Subtle Ambient Fingerprint Watermark */}
      <FingerprintPattern
        size={640}
        opacity={0.035}
        className="absolute -right-32 -top-16 text-[#0090AD] rotate-45 pointer-events-none"
      />

      {/* Top Bar */}
      <header className="px-6 py-6 border-b border-slate-200/80 bg-white/70 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <FifthEventsLogo size={24} theme="light" />
          </Link>
        </div>
      </header>

      {/* Center Error Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-950 tracking-tight">
              An unexpected error occurred
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              The operation could not be completed at this time. Our telemetry system has logged the exception for immediate review.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Operation</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="py-6 border-t border-slate-200/80 text-center text-xs text-slate-500 font-mono relative z-10">
        FifthEvents • Operations Security &amp; Continuity
      </footer>
    </div>
  );
}
