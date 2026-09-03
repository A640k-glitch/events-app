"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isAuth) {
    return (
      <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden m-0 p-0 bg-white overscroll-none">
        {children}
      </div>
    );
  }

  if (isDashboard) {
    return (
      <div className="min-h-[100dvh] bg-[#0B0D13] text-[#F5F5F7] overscroll-none">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white text-[#0E0E0E] overscroll-none">
      <Navbar />
      <main className="flex-1 pt-16 overscroll-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
