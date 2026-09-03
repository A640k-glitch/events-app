"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  Mail, 
  Phone
} from "lucide-react";
import { api } from "@/lib/api-client";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";
import CwgLogo from "@/components/brand/CwgLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    try {
      setIsSubscribing(true);
      setErrorMsg("");
      const res = await api.subscribeNewsletter(email.trim().toLowerCase());
      if (res.success) {
        setIsSubscribed(true);
      } else {
        setErrorMsg((res as any).error || res.message || "Subscription failed");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to subscribe");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer 
      className="text-[#C4C4D4] border-t border-white/[0.12] font-sans text-center sm:text-left relative z-10 overflow-hidden"
      style={{
        backgroundColor: "rgba(8, 11, 18, 0.86)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12 relative z-10">
        
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Logo & Brief Description */}
          <div className="space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="inline-block">
              <FifthEventsLogo theme="dark" size={32} showSubtitle={true} />
            </Link>

            <p className="text-xs text-[#A6A6B8] leading-relaxed max-w-sm sm:max-w-none">
              The central hub for technology events, digital tickets, and product demos across <span className="text-white tracking-tight"><span className="font-bold">fifth</span><span className="font-light">lab</span></span> and CWG PLC.
            </p>
          </div>

          {/* Column 2: Product Links */}
          <div className="space-y-3.5 text-xs flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono">
              Product &amp; Solutions
            </div>
            <ul className="space-y-2.5 flex flex-col items-center sm:items-start">
              <li>
                <Link href="/events" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start">
                  Summit Schedule &amp; Agendas
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start">
                  FifthLab Product Suite
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start">
                  Digital Pass Management
                </Link>
              </li>
              <li>
                <a href="https://thefifthlab.com/bulkwave" target="_blank" rel="noopener noreferrer" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start gap-1">
                  <span>Bulkwave Payment Engine</span>
                  <ArrowUpRight className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <a href="https://thefifthlab.com/smerp" target="_blank" rel="noopener noreferrer" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start gap-1">
                  <span>Smerp Enterprise ERP</span>
                  <ArrowUpRight className="w-3 h-3 text-white/50" />
                </a>
              </li>
              <li>
                <a href="https://thefifthlab.com/finedge" target="_blank" rel="noopener noreferrer" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start gap-1">
                  <span>FinEdge Core Banking</span>
                  <ArrowUpRight className="w-3 h-3 text-white/50" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className="space-y-3.5 text-xs flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono">
              Company &amp; Ecosystem
            </div>
            <ul className="space-y-2.5 flex flex-col items-center sm:items-start">
              <li>
                <a 
                  href="https://thefifthlab.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start gap-1.5 group"
                >
                  <img src="/favicon.ico" alt="fifthlab" className="h-3.5 w-auto object-contain" />
                  <span className="tracking-tight leading-none"><span className="font-bold text-white">fifth</span><span className="font-light text-[#C8C8DC]">lab</span></span>
                  <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <a 
                  href="https://cwg-plc.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start gap-1.5 group"
                >
                  <CwgLogo className="h-3.5 w-auto text-[#C8C8DC] group-hover:text-white transition-colors" />
                  <span>CWG PLC Group</span>
                  <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <a 
                  href="https://thetexcellenceconference.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start gap-1.5 group"
                >
                  <img src="/brand/texcellence-icon.webp" alt="The TeXcellence Conference" className="h-3.5 w-auto object-contain shrink-0 group-hover:scale-110 transition-transform" />
                  <span>The TeXcellence Conference</span>
                  <ArrowUpRight className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" />
                </a>
              </li>
              <li>
                <Link href="/login" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start">
                  Staff Admin Console
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-[#C8C8DC] hover:text-white transition-colors inline-flex items-center justify-center sm:justify-start">
                  Schedule Executive Briefing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-3.5 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono">
              Contact &amp; Briefing
            </div>
            
            <div className="space-y-2 text-xs text-[#C8C8DC] flex flex-col items-center sm:items-start">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00B4D8]" />
                <a href="mailto:events@thefifthlab.com" className="hover:text-white transition-colors">
                  events@thefifthlab.com
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span>+234 (0) 1 448 9230</span>
              </div>
            </div>

            <div className="pt-2 space-y-2 w-full max-w-xs sm:max-w-none flex flex-col items-center sm:items-start">
              <span className="text-[11px] font-medium text-white/95">
                Subscribe for Summit Notices
              </span>
              
              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center sm:justify-start gap-2 w-full">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed to FifthLab summit briefings</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2 w-full">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/[0.08] border border-white/15 rounded-full px-3.5 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#00B4D8]"
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="px-4 py-2 bg-[#00B4D8] hover:bg-[#0096C7] text-white font-semibold rounded-full text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSubscribing ? "..." : "Join"}
                    </button>
                  </div>
                  {errorMsg && <p className="text-[11px] text-rose-400 text-center sm:text-left">{errorMsg}</p>}
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Subtle Divider Line & Bottom Row */}
        <div className="pt-8 border-t border-white/[0.1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8EA6] text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <a
              href="https://thefifthlab.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The FifthLab"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src="/favicon.ico" alt="The FifthLab" className="h-4 w-auto object-contain" />
            </a>
            <a
              href="https://cwg-plc.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CWG PLC Group"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <CwgLogo className="h-4 w-auto text-[#8E8EA6] hover:text-white transition-colors" />
            </a>
            <span>
              © {new Date().getFullYear()} <span className="font-bold text-white">fifth</span><span className="font-light text-white/90">lab</span> Nigeria • CWG PLC. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <a href="https://thefifthlab.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://thefifthlab.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://thefifthlab.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">NDPR Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

