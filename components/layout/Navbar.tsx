"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Calendar, 
  Sparkles, 
  ChevronDown, 
  Menu, 
  X, 
  Ticket, 
  TrendingUp, 
  ArrowRight,
  User,
  LogOut,
  MapPin,
  Bell,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  Box,
  Layers
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, notifications, markNotificationAsRead, clearNotifications, currentRegion, setRegion } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setNotifOpen(false);
    setRegionOpen(false);
  }, [pathname]);

  // Handle Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const regions = [
    "us-east-1 (N. Virginia)",
    "us-west-2 (Oregon)",
    "eu-west-1 (Ireland)",
    "ap-southeast-1 (Singapore)"
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-3 md:pt-4 px-2 sm:px-4">
        <div className="max-w-[1400px] mx-auto">
          {/* Main Rectangular Floating Navbar (No Rounded-Full Pills) */}
          <div className="rounded-xl border border-white/15 bg-black/90 backdrop-blur-xl px-3 sm:px-4 py-2 flex items-center justify-between shadow-2xl transition-all">
            
            {/* Left: Brand Logo & Main Nav */}
            <div className="flex items-center gap-3 md:gap-5 flex-1 min-w-0">
              <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                  <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
                    <Image
                      src="/fifthlab_nexus_logo.jpg"
                      alt="FifthLab Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover rounded-full"
                      priority
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                    Fifth<span className="text-blue-500 font-mono text-xs font-semibold">Events</span>
                  </span>
                </div>
              </Link>

              {/* Vertical Line Separator (Desktop) */}
              <div className="hidden lg:block h-5 w-px bg-white/20 shrink-0" />

              {/* Desktop Nav Items */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
                
                {/* 1. Explore Events Mega Menu */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu("explore")}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button className="px-3 py-1.5 text-white/80 hover:text-white flex items-center gap-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                    <span>Explore Events</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/50 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  <div className={`absolute left-0 top-full pt-2 transition-all duration-200 ${activeMegaMenu === "explore" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}>
                    <div className="w-[720px] rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-5 shadow-2xl">
                      <div className="grid grid-cols-3 gap-4">
                        
                        <Link href="/dashboard/events" className="group p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all flex flex-col gap-2">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">Tech & AI Summits</h4>
                            <p className="text-xs text-white/60 line-clamp-2 mt-0.5">Keynotes, developer workshops & AI innovation conferences.</p>
                          </div>
                        </Link>

                        <Link href="/dashboard/events" className="group p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all flex flex-col gap-2">
                          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white group-hover:text-purple-400 transition-colors">Music & Festivals</h4>
                            <p className="text-xs text-white/60 line-clamp-2 mt-0.5">Stadium concerts, indie showcases & festival line-ups.</p>
                          </div>
                        </Link>

                        <Link href="/dashboard/events" className="group p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all flex flex-col gap-2">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Ticket className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">Founder Meetups</h4>
                            <p className="text-xs text-white/60 line-clamp-2 mt-0.5">Venture networking, pitch nights & executive dinners.</p>
                          </div>
                        </Link>

                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span>Over 1,200+ active hybrid & in-person events nationwide</span>
                        </span>
                        <Link href="/dashboard/events" className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
                          View All Events <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Host & Organize Mega Menu */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu("host")}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button className="px-3 py-1.5 text-white/80 hover:text-white flex items-center gap-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                    <span>Host & Organize</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/50 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  <div className={`absolute left-0 top-full pt-2 transition-all duration-200 ${activeMegaMenu === "host" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}>
                    <div className="w-[640px] rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-5 shadow-2xl">
                      <div className="grid grid-cols-2 gap-4">
                        
                        <Link href="/dashboard/events" className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                          <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                            <Ticket className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">Events Console & Badges</h4>
                            <p className="text-xs text-white/60 mt-0.5">Automated QR badges, tier pricing & staff attendance manifest.</p>
                          </div>
                        </Link>

                        <Link href="/dashboard/leads" className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">Lead Capture & Analytics</h4>
                            <p className="text-xs text-white/60 mt-0.5">Real-time check-in metrics, attendee acquisition & CSV exports.</p>
                          </div>
                        </Link>

                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Solutions & Products Mega Menu */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setActiveMegaMenu("solutions")}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <button className="px-3 py-1.5 text-white/80 hover:text-white flex items-center gap-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                    <span>Solutions & Tech</span>
                    <ChevronDown className="w-3.5 h-3.5 text-white/50 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  <div className={`absolute left-0 top-full pt-2 transition-all duration-200 ${activeMegaMenu === "solutions" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"}`}>
                    <div className="w-[600px] rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-5 shadow-2xl">
                      <div className="grid grid-cols-2 gap-4">
                        
                        <Link href="/dashboard/products" className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                            <Box className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">Products Catalog</h4>
                            <p className="text-xs text-white/60 mt-0.5">Manage FifthLab Payments, Identity, Analytics & Compliance.</p>
                          </div>
                        </Link>

                        <Link href="/dashboard/settings" className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all">
                          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                            <SlidersHorizontal className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-white">System Settings</h4>
                            <p className="text-xs text-white/60 mt-0.5">Configure organization preferences, API keys & WAT timezone rules.</p>
                          </div>
                        </Link>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Links */}
                <Link href="/#pricing" className="px-3 py-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                  Pricing
                </Link>

                <Link href="/demo" className="px-3 py-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-1.5">
                  <span>Live Demo</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30">Interactive</span>
                </Link>

              </nav>
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifOpen((prev) => !prev)}
                  className="h-8 w-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 flex items-center justify-center transition-all relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadNotifs.length}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl p-3 shadow-2xl z-50 text-xs">
                    <div className="flex items-center justify-between px-2 pb-2 border-b border-white/10">
                      <span className="font-bold text-white">System Notifications</span>
                      <button onClick={clearNotifications} className="text-[10px] text-blue-400 hover:underline">Clear all</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2 py-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-4 text-white/40">No new notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${n.read ? "bg-white/5 border-white/5 opacity-60" : "bg-blue-500/10 border-blue-500/30 text-white font-medium"}`}
                          >
                            <h5 className="font-semibold text-white text-xs">{n.title}</h5>
                            <p className="text-[11px] text-white/70 mt-0.5">{n.message}</p>
                            <span className="text-[9px] text-white/40 mt-1 block">{n.timestamp}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Search Trigger Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="h-8 sm:h-9 px-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs sm:text-sm flex items-center gap-2 transition-all shadow-inner cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-white/60" />
                <span className="hidden sm:inline">Search...</span>
                <div className="hidden md:flex items-center gap-1 ml-1">
                  <kbd className="h-4 px-1 rounded text-[10px] font-mono bg-white/10 text-white/60 border border-white/10">⌘K</kbd>
                </div>
              </button>

              {/* User Account / Auth Actions */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="h-8 sm:h-9 px-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">{user.name.split(" ")[0]}'s Hub</span>
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="h-8 w-8 rounded-full border border-white/10 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 text-white/70 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden xs:flex h-8 sm:h-9 px-3.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium items-center transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className="h-8 sm:h-9 px-3.5 sm:px-4 rounded-full bg-white text-black hover:bg-white/90 text-xs sm:text-sm font-bold flex items-center gap-1 transition-all shadow-lg"
                  >
                    <span>Get Started</span>
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden h-8 w-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation (Designed down to iPhone 5/6 320px micro-screens) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-xl pt-20 px-4 pb-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="max-w-md mx-auto flex flex-col gap-6">
            
            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search events, cities, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Mobile Nav Menu Categories */}
            <div className="space-y-4 text-sm">
              <div className="border-b border-white/10 pb-3">
                <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Platform Hub</div>
                <div className="flex flex-col gap-1">
                  <Link href="/" className="px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/5 font-medium flex items-center justify-between">
                    <span>Home & Overview</span>
                  </Link>
                  <Link href="/dashboard" className="px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/5 font-medium flex items-center justify-between">
                    <span>Dashboard Overview</span>
                    <Sparkles className="w-4 h-4 text-blue-400" />
                  </Link>
                  <Link href="/dashboard/events" className="px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/5 font-medium flex items-center justify-between">
                    <span>Events Management</span>
                  </Link>
                  <Link href="/dashboard/leads" className="px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/5 font-medium flex items-center justify-between">
                    <span>Lead Acquisition</span>
                  </Link>
                  <Link href="/dashboard/products" className="px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/5 font-medium flex items-center justify-between">
                    <span>Products Console</span>
                  </Link>
                  <Link href="/dashboard/settings" className="px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/5 font-medium flex items-center justify-between">
                    <span>Settings & Region</span>
                  </Link>
                  <Link href="/demo" className="px-3 py-2 text-white/90 hover:text-white rounded-lg hover:bg-white/5 font-medium flex items-center justify-between">
                    <span>Interactive Demo</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded">Live</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Auth Button */}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm text-center"
                  >
                    Login to Account
                  </Link>
                  <Link
                    href="/dashboard"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm text-center shadow-lg"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0e1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search events, leads, products, or pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white text-base focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 max-h-[360px] overflow-y-auto space-y-2">
              <div className="text-xs font-semibold text-white/40 uppercase tracking-wider px-2">Quick Route Navigation</div>
              {[
                { title: "Dashboard Overview", path: "/dashboard", desc: "Command center metrics & telemetry" },
                { title: "Events Discovery & Staff Manifest", path: "/dashboard/events", desc: "Manage event attendance & schedule" },
                { title: "Lead Acquisition Table", path: "/dashboard/leads", desc: "Captured leads, booking dates & export" },
                { title: "Products Console", path: "/dashboard/products", desc: "Manage product owners & availability" },
                { title: "System Settings", path: "/dashboard/settings", desc: "AWS region & cloud configuration" },
                { title: "Visitor Demo Booking Page", path: "/demo", desc: "Interactive executive briefing suite" }
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.path}
                  onClick={() => setSearchOpen(false)}
                  className="p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-between group transition-all"
                >
                  <div>
                    <h5 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{item.title}</h5>
                    <p className="text-xs text-white/50">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
            
            <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white/70">ESC</kbd> to exit</span>
              <span>FifthLab Nexus Events</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
