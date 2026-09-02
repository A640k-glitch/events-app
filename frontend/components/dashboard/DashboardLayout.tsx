"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import { useApp } from "@/context/AppContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#0090AD] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-sans font-medium">Loading operations center...</p>
      </div>
    );
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
