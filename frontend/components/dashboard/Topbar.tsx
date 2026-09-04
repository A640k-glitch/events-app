"use client";

import { Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const pathname = usePathname();
  const { user, setCommandPaletteOpen } = useApp();

  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return { section: "Dashboard", label: "Overview" };
    if (pathname.startsWith("/dashboard/events")) return { section: "Dashboard", label: "Events & Summits" };
    if (pathname.startsWith("/dashboard/leads")) return { section: "Dashboard", label: "Attendee Leads" };
    if (pathname.startsWith("/dashboard/products")) return { section: "Dashboard", label: "Product Demos" };
    if (pathname.startsWith("/dashboard/team")) return { section: "Dashboard", label: "Team Directory" };
    if (pathname.startsWith("/dashboard/settings")) return { section: "Dashboard", label: "Preferences" };
    return { section: "Dashboard", label: "Overview" };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-16 border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 font-sans select-none">
      
      {/* 1. Left: Mobile Hamburger & Dynamic Clean Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-slate-500 hover:text-slate-900 lg:hidden border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">{breadcrumb.section}</span>
          <span className="text-slate-300 font-mono">/</span>
          <span className="font-bold text-slate-900 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60">
            {breadcrumb.label}
          </span>
        </div>
      </div>

      {/* 2. Right: Command Search & User Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search / Command Shortcut */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs text-slate-500 hover:text-slate-900 transition-all cursor-pointer shadow-2xs group"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0090AD] transition-colors" />
          <span className="text-xs">Search dashboard...</span>
          <kbd className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-mono text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0090AD] to-[#229EA6] text-white font-bold text-xs flex items-center justify-center shadow-xs border border-[#2DD4BF]/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
        </div>

      </div>

    </header>
  );
}
