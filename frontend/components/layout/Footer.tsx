"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  Share2
} from "lucide-react";
import { api } from "@/lib/api-client";
import FifthEventsLogo, { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";

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
    <footer className="bg-[#0B0D13]/80 backdrop-blur-md text-[#A3A3B2] border-t border-white/[0.08] font-sans text-left relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12 relative z-10">
        
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Logo, Address, Socials */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <FifthEventsLogo theme="dark" size={32} />
            </Link>

            <p className="text-xs text-[#A3A3B2]/80 leading-relaxed">
              Enterprise event operations, digital pass management, and attendee lead intelligence for The FifthLab and CWG PLC ecosystems.
            </p>

            <div className="space-y-1.5 pt-2 text-xs text-[#A3A3B2]/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#00B4D8] shrink-0" />
                <span>CWG Complex, Lekki Phase 1, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>NDPR & ISO 27001 Certified Infrastructure</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://thefifthlab.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-[#00B4D8]/20 hover:text-[#00B4D8] text-white/70 flex items-center justify-center transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://cwg-plc.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share"
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-[#00B4D8]/20 hover:text-[#00B4D8] text-white/70 flex items-center justify-center transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Product Links */}
          <div className="space-y-3.5 text-xs">
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono">
              Product & Solutions
            </div>
            <ul className="space-y-2.5">
              <li>
                <Link href="/events" className="hover:text-white transition-colors">
                  Summit Schedule & Agendas
                </Link>
              </li>
              <li>
                <Link href="/#solutions" className="hover:text-white transition-colors">
                  Lead Intelligence CRM
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-white transition-colors">
                  Digital Pass Management
                </Link>
              </li>
              <li>
                <Link href="/demo?product=bulkwave" className="hover:text-white transition-colors">
                  Bulkwave Payment Engine
                </Link>
              </li>
              <li>
                <Link href="/demo?product=smerp" className="hover:text-white transition-colors">
                  Smerp Enterprise ERP
                </Link>
              </li>
              <li>
                <Link href="/demo?product=finedge" className="hover:text-white transition-colors">
                  FinEdge Financial Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className="space-y-3.5 text-xs">
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono">
              Company & Ecosystem
            </div>
            <ul className="space-y-2.5">
              <li>
                <a 
                  href="https://thefifthlab.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>The FifthLab Innovation</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a 
                  href="https://cwg-plc.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>CWG PLC Group</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <a 
                  href="https://texcellence.cwg-plc.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Texcellence Summit</span>
                  <ArrowUpRight className="w-3 h-3 text-white/40" />
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Staff Admin Console
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-white transition-colors">
                  Schedule Executive Briefing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-3.5">
            <div className="text-[11px] font-semibold text-white uppercase tracking-wider font-mono">
              Contact & Briefing
            </div>
            
            <div className="space-y-2 text-xs text-[#A3A3B2]/80">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#00B4D8]" />
                <a href="mailto:events@thefifthlab.com" className="hover:text-white transition-colors">
                  events@thefifthlab.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#00B4D8]" />
                <span>+234 (0) 1 448 9230</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-medium text-white/90">
                Subscribe for Summit Notices
              </span>
              
              {isSubscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed to FifthLab summit briefings</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/[0.06] border border-white/10 rounded-full px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#00B4D8]"
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="px-4 py-2 bg-[#00B4D8] hover:bg-[#0096C7] text-white font-semibold rounded-full text-xs transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSubscribing ? "..." : "Join"}
                    </button>
                  </div>
                  {errorMsg && <p className="text-[11px] text-rose-400">{errorMsg}</p>}
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Subtle Divider Line & Bottom Row */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A3A3B2]/60">
          <div>
            © {new Date().getFullYear()} The FifthLab Nigeria • CWG PLC. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://thefifthlab.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://thefifthlab.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://thefifthlab.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">NDPR Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

