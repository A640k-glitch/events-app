"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, RefreshCw } from "lucide-react";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRefresh = () => {
    setIsRetrying(true);
    // Hard reload fixes ChunkLoadError and stale webpack chunks reliably
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans text-left">
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <FifthEventsLogo size={24} theme="light" />
          </Link>
        </div>
      </header>

      {/* Center Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          
          <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-950 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              {isRetrying ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>Refresh Page</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
        FifthEvents
      </footer>
    </div>
  );
}
