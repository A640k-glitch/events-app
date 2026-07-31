"use client";

import { Menu, Search, Bell, ExternalLink, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  return (
    <header className="h-16 border-b border-[#232323] bg-[#0d0d0d]/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMenuToggle}
          className="p-2 text-[#8e8e93] hover:text-white lg:hidden border border-[#232323] rounded-xs bg-[#141414]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Dense AWS-style Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#636366]" />
          <input
            type="text"
            placeholder="Search events, leads, products, owners... (Press '/' to focus)"
            className="w-full bg-[#141414] border border-[#232323] focus:border-[#0a84ff] text-xs text-white placeholder-[#636366] pl-9 pr-8 py-1.5 rounded-xs outline-none transition-colors font-mono"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#636366] bg-[#202022] px-1 py-0.2 rounded-xs border border-[#333]">
            /
          </kbd>
        </div>
      </div>

      {/* Actions & Status Indicator */}
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-[#141414] border border-[#232323] rounded-xs text-[11px] font-mono text-[#8e8e93]">
          <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
          <span>AWS US-East-1 (Connected)</span>
        </div>

        <Link
          href="/demo"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#0a84ff]/10 hover:bg-[#0a84ff]/20 text-[#0a84ff] border border-[#0a84ff]/30 rounded-xs text-xs font-mono font-medium transition-colors"
        >
          <span>Book Demo Page</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        {/* Notifications Button */}
        <button 
          className="relative p-2 text-[#8e8e93] hover:text-white border border-[#232323] rounded-xs bg-[#141414] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#0a84ff] rounded-full" />
        </button>
      </div>
    </header>
  );
}
