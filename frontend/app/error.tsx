"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, Compass, RefreshCw, ChevronRight } from "lucide-react";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [isChunkError, setIsChunkError] = useState(false);

  useEffect(() => {
    console.error("[System Error]", error);
    if (
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("missing: ")
    ) {
      setIsChunkError(true);
    }
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    // If it is a webpack ChunkLoadError or cache desync, a normal client-side reset()
    // will just re-trigger the missing chunk fetch and fail repeatedly.
    // We do a hard window reload to fetch the newly generated build manifest from the server.
    if (
      isChunkError ||
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("chunk")
    ) {
      window.location.reload();
      return;
    }

    try {
      reset();
    } catch {
      window.location.reload();
    } finally {
      setTimeout(() => setIsRetrying(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none text-left">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0090AD]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Ambient Watermark */}
      <FingerprintPattern
        size={720}
        opacity={0.04}
        className="absolute -right-40 -top-24 text-[#0090AD] rotate-45 pointer-events-none"
      />

      {/* Top Header */}
      <header className="px-6 py-5 border-b border-white/10 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <FifthEventsLogo size={24} theme="dark" />
          </Link>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Telemetry Exception</span>
          </div>
        </div>
      </header>

      {/* Main Error Center */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="max-w-lg w-full text-center space-y-6">
          
          {/* Animated Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-mono font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{isChunkError ? "Asset Sync Required (ChunkLoadError)" : "Client Runtime Exception"}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isChunkError ? "New Update Available" : "An unexpected error occurred"}
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
              {isChunkError
                ? "The application was recently deployed with updated assets. Reloading will sync the latest compiled code into your session."
                : "The operation could not be completed at this time. Our telemetry system has logged the exception for immediate review."}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-[#0090AD] hover:bg-[#007A94] disabled:opacity-75 text-white text-xs font-semibold shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              {isRetrying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>{isChunkError ? "Refresh & Sync Now" : "Retry Operation"}</span>
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold shadow-xs transition-all whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-[#0090AD]" />
              <span>Go to Dashboard</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>

          {/* Quick Helpful Links */}
          <div className="pt-4 border-t border-white/10 text-left bg-white/5 p-4 rounded-lg border border-white/10">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-2 font-mono">
              Quick Recovery Destinations
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/dashboard/events"
                className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <span>Events &amp; Attendance</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <span>Product Matrix</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Meta */}
      <footer className="py-5 border-t border-white/10 text-center text-xs text-slate-500 font-mono relative z-10">
        FifthEvents • Operations Security &amp; Continuity
      </footer>
    </div>
  );
}
