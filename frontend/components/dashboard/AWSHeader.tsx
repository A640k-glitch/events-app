"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Bell, 
  Globe, 
  ChevronDown, 
  Menu, 
  ExternalLink, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  Users, 
  CalendarDays, 
  Activity,
  X,
  Check
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface AWSHeaderProps {
  onMenuToggle?: () => void;
}

export default function AWSHeader({ onMenuToggle }: AWSHeaderProps) {
  const { currentRegion, setRegion, notifications, markNotificationAsRead, clearNotifications, setCommandPaletteOpen, user, logout } = useApp();
  const [isRegionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [isServicesOpen, setServicesOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [isAccountOpen, setAccountOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const regions = [
    { code: "us-east-1 (N. Virginia)", name: "US East (N. Virginia)" },
    { code: "eu-west-1 (Ireland)", name: "EU West (Ireland)" },
    { code: "ap-southeast-1 (Singapore)", name: "Asia Pacific (Singapore)" },
    { code: "us-west-2 (Oregon)", name: "US West (Oregon)" },
  ];

  return (
    <header className="h-12 bg-[#161e2e] border-b border-[#29364d] text-white flex items-center justify-between px-3 z-30 sticky top-0 font-sans select-none">
      {/* Left: AWS Branding & Services Drawer Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 text-[#aab7c4] hover:text-white lg:hidden"
          aria-label="Toggle Side Nav"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* AWS & FifthLab Logo + Console Home */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 flex items-center justify-center shrink-0 shadow-md">
            <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
              <Image
                src="/plogo.jpg"
                alt="FifthLab Logo"
                width={24}
                height={24}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <span className="text-xs font-bold tracking-tight text-white group-hover:text-[#ff9900] transition-colors">
            FifthLab Console
          </span>
        </Link>

        {/* Services Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setServicesOpen(!isServicesOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#aab7c4] hover:text-white hover:bg-[#232f3e] rounded-xs border border-transparent hover:border-[#3c4e66] transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-[#ff9900]" />
            <span>Services</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isServicesOpen && (
            <div className="absolute left-0 top-full mt-1 w-64 bg-[#1b2537] border border-[#29364d] shadow-2xl rounded-xs p-2 z-50 space-y-1 font-mono text-xs animate-in fade-in duration-150">
              <div className="px-2 py-1 text-[10px] text-[#7d8f9e] uppercase tracking-wider">
                FifthLab Console Modules
              </div>

              <Link
                href="/dashboard"
                onClick={() => setServicesOpen(false)}
                className="flex items-center gap-2.5 p-2 hover:bg-[#29364d] text-white rounded-xs"
              >
                <Activity className="w-3.5 h-3.5 text-[#ff9900]" />
                <span>Command Center Overview</span>
              </Link>

              <Link
                href="/dashboard/events"
                onClick={() => setServicesOpen(false)}
                className="flex items-center gap-2.5 p-2 hover:bg-[#29364d] text-white rounded-xs"
              >
                <CalendarDays className="w-3.5 h-3.5 text-[#0a84ff]" />
                <span>Event Discovery & Attendance</span>
              </Link>

              <Link
                href="/dashboard/leads"
                onClick={() => setServicesOpen(false)}
                className="flex items-center gap-2.5 p-2 hover:bg-[#29364d] text-white rounded-xs"
              >
                <Users className="w-3.5 h-3.5 text-[#30d158]" />
                <span>Lead Acquisition Dashboard</span>
              </Link>

              <Link
                href="/demo"
                target="_blank"
                onClick={() => setServicesOpen(false)}
                className="flex items-center gap-2.5 p-2 hover:bg-[#29364d] text-[#ff9900] rounded-xs pt-2 border-t border-[#29364d]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Public Visitor Demo Flow</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Center: AWS Global Search Input (Triggers Command Palette CMD+K) */}
      <div className="flex-1 max-w-xl mx-4 hidden sm:block">
        <div 
          onClick={() => setCommandPaletteOpen(true)}
          className="relative w-full cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8f9e] group-hover:text-white" />
          <div className="w-full bg-[#0f141d] border border-[#29364d] group-hover:border-[#ff9900] text-xs text-[#aab7c4] group-hover:text-white pl-9 pr-16 py-1 rounded-xs flex items-center justify-between font-mono transition-all">
            <span className="truncate">Search services, events, leads, products...</span>
            <kbd className="text-[10px] font-mono text-[#7d8f9e] bg-[#161e2e] px-1.5 py-0.5 rounded-xs border border-[#29364d]">
              ⌘K / Ctrl+K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: AWS Console Utility Toolbar */}
      <div className="flex items-center gap-2 font-mono text-xs text-[#aab7c4]">
        {/* AWS Region Selector */}
        <div className="relative">
          <button
            onClick={() => setRegionDropdownOpen(!isRegionDropdownOpen)}
            className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#232f3e] hover:text-white rounded-xs border border-transparent hover:border-[#3c4e66] transition-all text-[11px]"
          >
            <Globe className="w-3.5 h-3.5 text-[#30d158]" />
            <span className="hidden lg:inline">{currentRegion}</span>
            <span className="lg:hidden">{currentRegion.split(" ")[0]}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {isRegionDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-[#1b2537] border border-[#29364d] shadow-2xl rounded-xs p-1.5 z-50 space-y-1 text-xs">
              <div className="px-2 py-1 text-[10px] text-[#7d8f9e] uppercase">
                Select AWS Region
              </div>
              {regions.map((r) => (
                <button
                  key={r.code}
                  onClick={() => {
                    setRegion(r.code);
                    setRegionDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left p-2 rounded-xs flex items-center justify-between hover:bg-[#29364d] transition-colors",
                    currentRegion === r.code ? "text-[#ff9900] font-bold bg-[#232f3e]" : "text-white"
                  )}
                >
                  <span>{r.name}</span>
                  {currentRegion === r.code && <Check className="w-3 h-3 text-[#ff9900]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications & System Health Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!isNotifOpen)}
            className="relative p-1.5 hover:bg-[#232f3e] hover:text-white rounded-xs transition-colors"
            aria-label="AWS Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#ff9900] rounded-full animate-ping" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-[#1b2537] border border-[#29364d] shadow-2xl rounded-xs p-3 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-[#29364d] pb-2 text-xs">
                <span className="font-bold text-white">AWS Health Alerts ({unreadNotifs})</span>
                <button
                  onClick={clearNotifications}
                  className="text-[10px] text-[#7d8f9e] hover:text-white"
                >
                  Clear All
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-[#7d8f9e] text-center py-4">No active system notifications.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={cn(
                        "p-2.5 rounded-xs border text-xs space-y-1 cursor-pointer transition-colors",
                        n.read ? "bg-[#161e2e] border-[#29364d] opacity-60" : "bg-[#232f3e] border-[#ff9900]/40 text-white"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#ff9900] text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-[#7d8f9e]">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-[#aab7c4] leading-snug">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* AWS User Account & IAM Role Selector */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setAccountOpen(!isAccountOpen)}
              className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#232f3e] hover:text-white rounded-xs border border-transparent hover:border-[#3c4e66] transition-all text-[11px]"
            >
              <span className="text-[#ff9900] font-bold">{user.name || "FifthLab Staff"}</span>
              <span className="text-[#7d8f9e] hidden xl:inline">({user.role || "Staff"})</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-3 py-1 bg-[#ff9900] hover:bg-[#ec8b00] text-black font-bold rounded-xs text-[11px] transition-all"
            >
              Sign In to Console
            </Link>
          )}

          {isAccountOpen && user && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-[#1b2537] border border-[#29364d] shadow-2xl rounded-xs p-3 z-50 space-y-3 text-xs">
              <div className="space-y-1 border-b border-[#29364d] pb-2">
                <span className="text-[10px] text-[#7d8f9e] uppercase">Authenticated Identity</span>
                <p className="text-white font-bold">{user.name}</p>
                <p className="text-[10px] text-[#aab7c4] truncate">{user.email}</p>
                <p className="text-[10px] text-[#30d158]">Role: {user.role || "Staff Operator"}</p>
              </div>

              <div className="space-y-1 text-[11px]">
                <Link href="/dashboard/settings" onClick={() => setAccountOpen(false)} className="block p-1.5 hover:bg-[#29364d] text-white rounded-xs">
                  Account Settings
                </Link>
                <button 
                  onClick={() => {
                    setAccountOpen(false);
                    logout();
                  }} 
                  className="w-full text-left block p-1.5 hover:bg-[#29364d] text-[#ff453a] rounded-xs cursor-pointer"
                >
                  Sign Out of Console
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
