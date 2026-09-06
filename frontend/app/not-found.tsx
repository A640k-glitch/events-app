import Link from "next/link";
import { Home, Calendar, Compass } from "lucide-react";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function NotFound() {
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

      {/* Center 404 Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <span className="text-sm font-bold uppercase tracking-wider text-[#005B6E] block font-mono">
              404 Error
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md bg-[#005B6E] hover:bg-[#004754] text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-[#005B6E]" />
              <span>Go to Dashboard</span>
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

