"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/90 pt-12 pb-8 px-4 text-sm text-white/70">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Overview */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src="/plogo.jpg"
                  alt="FifthLab Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Fifth<span className="text-blue-500 font-mono text-xs font-semibold">Events</span>
              </span>
            </Link>
            <p className="text-xs text-white/60 max-w-sm leading-relaxed">
              Enterprise event management platform. Streamlined ticketing, lead acquisition, and real-time operational analytics for modern organizers & enterprises.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#events" className="hover:text-cyan-400 transition-colors">Explore Events</Link></li>
              <li><Link href="/#pricing" className="hover:text-cyan-400 transition-colors">Pricing & Passes</Link></li>
              <li><Link href="/demo" className="hover:text-cyan-400 transition-colors flex items-center gap-1">Live Demo <ArrowUpRight className="w-3 h-3" /></Link></li>
              <li><Link href="/login" className="hover:text-cyan-400 transition-colors">Staff Operations Portal</Link></li>
            </ul>
          </div>

          {/* Solutions Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Solutions</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard/leads" className="hover:text-blue-400 transition-colors">Lead Capture</Link></li>
              <li><Link href="/dashboard/events" className="hover:text-blue-400 transition-colors">Attendee Badges</Link></li>
              <li><Link href="/dashboard/products" className="hover:text-blue-400 transition-colors">Products Catalog</Link></li>
              <li><Link href="/dashboard/settings" className="hover:text-blue-400 transition-colors">System Settings</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} FifthEvents Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-white/50">
            <Link href="/#pricing" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/#pricing" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
