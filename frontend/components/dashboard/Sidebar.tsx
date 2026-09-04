"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  CalendarDays, 
  Users, 
  Layers, 
  Settings, 
  LogOut,
  UserCheck,
  ChevronLeft,
  User as UserIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import FifthEventsLogo, { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Lock background scroll when mobile sidebar drawer is open
  useBodyScrollLock(Boolean(isOpen));

  const pathname = usePathname();
  const { user, logout, stats } = useApp();

  const navSections = [
    {
      title: "ADMIN CENTER",
      items: [
        { 
          name: "Dashboard", 
          href: "/dashboard", 
          icon: Compass,
          badge: null
        },
      ]
    },
    {
      title: "MANAGEMENT",
      items: [
        { 
          name: "Events & Summits", 
          href: "/dashboard/events", 
          icon: CalendarDays,
          badge: stats.upcomingEventsCount > 0 ? `${stats.upcomingEventsCount}` : null,
          badgeColor: "bg-slate-800 text-slate-300 border border-slate-700"
        },
        { 
          name: "Attendee Leads", 
          href: "/dashboard/leads", 
          icon: Users,
          badge: stats.unreadLeadsCount > 0 ? `${stats.unreadLeadsCount} new` : null,
          badgeColor: "bg-[#20B2AA]/20 text-[#2DD4BF] border border-[#20B2AA]/30"
        },
        { 
          name: "Product Demos", 
          href: "/dashboard/products", 
          icon: Layers,
          badge: null
        },
      ]
    },
    {
      title: "ORGANIZATION",
      items: [
        { 
          name: "Team Directory", 
          href: "/dashboard/team", 
          icon: UserCheck,
          badge: null
        },
        { 
          name: "Preferences", 
          href: "/dashboard/settings", 
          icon: Settings,
          badge: null
        },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* FifthEvents Compact Midnight Left Navigation Sidebar */}
      <aside
        className={cn(
          "w-60 bg-gradient-to-b from-[#0F172A] via-[#0D1527] to-[#0A1020] border-r border-slate-800/80 p-3.5 flex flex-col justify-between shrink-0 font-sans z-40 transition-all text-left relative overflow-hidden",
          isOpen
            ? "fixed inset-y-0 left-0 shadow-2xl flex"
            : "hidden lg:flex lg:sticky lg:top-0 lg:h-screen"
        )}
      >
        {/* Vibrant Colored Logo SVG Watermark in Background */}
        <div className="absolute -bottom-8 -left-8 pointer-events-none -z-0 opacity-[0.14] select-none rotate-[-8deg] filter drop-shadow-[0_10px_20px_rgba(0,144,173,0.3)]">
          <FifthEventsEmblem size={240} monochrome={false} />
        </div>
        
        {/* Subtle Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#0090AD]/15 blur-2xl pointer-events-none -z-0" />

        {/* Top & Navigation Content with Tight Spacing */}
        <div className="space-y-4 relative z-10">
          
          {/* 1. Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-[#2DD4BF] transition-colors group"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>

          {/* 2. FifthEvents Logo */}
          <div className="pt-1 pb-1">
            <FifthEventsLogo size={22} theme="dark" showSubtitle={false} />
          </div>

          {/* 3. Navigation Groups (Tight, Compact Spacing) */}
          <nav className="space-y-3.5 pt-0.5">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider px-2.5 font-mono block">
                  {section.title}
                </span>

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[11.5px] font-medium transition-all group",
                          isActive
                            ? "bg-gradient-to-r from-[#0090AD] to-[#229EA6] text-white font-bold shadow-md shadow-[#0090AD]/25"
                            : "text-slate-400 hover:text-white hover:bg-white/[0.07]"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={cn(
                            "w-3.5 h-3.5 shrink-0 transition-colors",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                          )} />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge && (
                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded-md font-mono shrink-0 leading-none",
                            isActive
                              ? "bg-white/20 text-white font-bold"
                              : item.badgeColor || "bg-slate-800 text-slate-300"
                          )}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* 4. Bottom Controls (Tightened Spacing) */}
        <div className="pt-3 border-t border-slate-800/90 space-y-1.5 relative z-10">
          
          {/* Sign Out Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer group"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform shrink-0" />
            <span>Log Out</span>
          </button>

          {/* Account Details Box */}
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 transition-all text-left group"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0090AD] to-[#229EA6] text-white font-bold text-xs flex items-center justify-center shrink-0 border border-[#2DD4BF]/30 shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[11px] font-semibold text-white group-hover:text-[#2DD4BF] transition-colors truncate">
                  {user?.name || "Corporate Admin"}
                </span>
                <span className="text-[9.5px] text-slate-400 truncate font-mono">
                  {user?.role || "Staff Lead"}
                </span>
              </div>
            </div>

            <UserIcon className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0" />
          </Link>

        </div>
      </aside>
    </>
  );
}
