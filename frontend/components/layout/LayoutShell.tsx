"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollLogoBackground from "@/components/home/ScrollLogoBackground";
import { cn } from "@/lib/utils";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDarkHeroPage = pathname.startsWith("/events") || pathname.startsWith("/products");

  // Scroll to top on every page transition (unless an anchor hash like #about is targeted)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

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
    <div
      className={cn(
        "min-h-[100dvh] flex flex-col overscroll-none relative",
        isDarkHeroPage ? "bg-[#06090e]" : "bg-white text-[#0E0E0E]"
      )}
    >
      {/* Scroll-driven logo background — only on public pages with light hero banners */}
      {!isDarkHeroPage && <ScrollLogoBackground />}
      <Navbar />
      <main
        className={cn(
          "flex-1 overscroll-none relative",
          isDarkHeroPage ? "pt-0" : "pt-16"
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

