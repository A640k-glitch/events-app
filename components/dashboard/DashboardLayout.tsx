"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import CommandPalette from "./CommandPalette";
import { useApp } from "@/context/AppContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // If user explicitly logged out, redirect to /login
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center font-sans space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-white/60">Redirecting to login portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[88vh] bg-[#08090b] text-[#f5f5f7] flex flex-col font-sans">
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 max-w-[1400px] w-full mx-auto px-2 sm:px-4 py-4 gap-4">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
