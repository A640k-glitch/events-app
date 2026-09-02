"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-[#0B0D13] text-[#F5F5F7]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0E0E0E]">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
