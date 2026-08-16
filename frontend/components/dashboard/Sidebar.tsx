"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Layers, 
  Settings, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useApp();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Events Manifest", href: "/dashboard/events", icon: CalendarDays },
    { name: "Captured Leads", href: "/dashboard/leads", icon: Users },
    { name: "Products Console", href: "/dashboard/products", icon: Layers },
    { name: "System Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "w-full lg:w-64 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-4 flex flex-col justify-between shadow-2xl transition-all font-sans shrink-0",
          isOpen ? "fixed inset-y-4 left-4 z-50 w-72" : "hidden lg:flex"
        )}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shrink-0">
                <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center">
                  <Image
                    src="/plogo.jpg"
                    alt="FifthLab Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight">
                  Console Hub
                </span>
                <span className="text-[10px] text-white/50 font-mono">
                  FifthLab Nexus v2.1
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              Live
            </span>
          </div>

          {/* Navigation Pills */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider px-3 pb-1">
              Modules & Tabs
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-full transition-all group cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-white" : "text-white/50 group-hover:text-blue-400")} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </Link>
              );
            })}
          </div>

          {/* Public Gateway Section */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider px-3 pb-1">
              Visitor Gateway
            </div>
            <Link
              href="/demo"
              className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Executive Demo</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Interactive
              </span>
            </Link>
          </div>
        </div>

        {/* User Account Info */}
        <div className="pt-4 border-t border-white/10">
          <div className="p-3 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-white font-bold text-xs">
                {user ? user.name.charAt(0) : "A"}
              </div>
              <div className="flex flex-col min-w-0 text-xs">
                <span className="font-semibold text-white truncate">
                  {user ? user.name : "Alex Rivera"}
                </span>
                <span className="text-[10px] text-white/50 truncate">
                  {user ? user.role : "Staff Architect"}
                </span>
              </div>
            </div>
            {user && (
              <button 
                onClick={logout}
                className="text-white/50 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
