"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import { useApp } from "@/context/AppContext";

import LogoChargingLoader from "@/components/brand/LogoChargingLoader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, authInitialized } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Only redirect when auth restoration has finished and no user exists
    if (authInitialized && !user) {
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("fifthlab_user") : null;
      if (!savedUser) {
        router.push("/login");
      }
    }
  }, [user, authInitialized, router]);

  if (!authInitialized) {
    return <LogoChargingLoader fullScreen={true} message="Loading dashboard..." />;
  }

  if (!user) {
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("fifthlab_user") : null;
    if (savedUser) {
      return <LogoChargingLoader fullScreen={true} message="Restoring session..." />;
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row font-sans selection:bg-[#0090AD]/20 selection:text-[#0090AD]">
      {/* Left Navigation Sidebar */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#F8FAFC]">
        <Topbar onMenuToggle={() => setMobileSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
