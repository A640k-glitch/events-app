"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ArrowRight, LayoutDashboard, LogIn } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useBodyScrollLock } from "@/lib/useBodyScrollLock";
import { cn } from "@/lib/utils";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inAboutSection, setInAboutSection] = useState(false);

  // Universal background scroll lock when mobile navigation is open
  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy to detect when user is viewing the About section on the landing page
  useEffect(() => {
    if (pathname !== "/") {
      setInAboutSection(false);
      return;
    }

    const checkAboutInView = () => {
      const aboutEl = document.getElementById("about");
      if (!aboutEl) {
        setInAboutSection(false);
        return;
      }
      const rect = aboutEl.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      // Active when scrolled into the about section
      const inView = rect.top <= windowHeight * 0.45 && rect.bottom >= 150;
      setInAboutSection(inView);
    };

    checkAboutInView();
    window.addEventListener("scroll", checkAboutInView, { passive: true });
    return () => window.removeEventListener("scroll", checkAboutInView);
  }, [pathname]);

  const navLinks = [
    { name: "Events", href: "/events" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/#about" },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/#about") {
      return pathname === "/" && inAboutSection;
    }
    return pathname === href;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);
    if (href === "/#about") {
      if (pathname === "/") {
        e.preventDefault();
        const aboutEl = document.getElementById("about");
        if (aboutEl) {
          aboutEl.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", "#about");
          setInAboutSection(true);
        }
      }
    }
  };

  return (
    <>
      {/* Background Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Top Navbar Capsule (Fixed & Stable, Zero Morphing) */}
      <header
        className={cn(
          "fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-6xl z-50",
          "bg-white/90 backdrop-blur-2xl border border-white/80 rounded-full py-2.5 sm:py-3 px-4 sm:px-7 shadow-[0_8px_32px_0_rgba(17,24,39,0.08)]",
          scrolled ? "shadow-[0_12px_40px_0_rgba(17,24,39,0.12)] py-2 sm:py-2.5" : ""
        )}
      >
        <div className="flex items-center justify-between gap-3 relative">
          
          {/* 1. Left: Official FifthEvents Logo */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
            >
              <FifthEventsLogo size={26} theme="light" />
            </Link>
          </div>

          {/* 2. Middle: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => {
              const isActive = checkIsActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, link.href)}
                  className={cn(
                    "text-xs font-semibold transition-all relative py-1",
                    isActive
                      ? "text-[#0090AD]"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#0090AD]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Desktop Auth Buttons + Mobile Hamburger/Close Button */}
          <div className="flex items-center gap-2">
            
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-black transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 transition-colors"
                  >
                    Portal Login
                  </Link>

                  <Link
                    href="/demo"
                    className="px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[#0090AD] to-[#229EA6] text-white hover:from-[#007A94] hover:to-[#1E8B92] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <span>Book Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger / Close Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 md:hidden rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Directly Attached Downward Dropdown Menu — High-polish mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[calc(100%+10px)] left-0 right-0 w-full bg-white/98 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.22)] p-4 sm:p-5 text-left space-y-3.5 animate-in fade-in-0 zoom-in-95 duration-150">
            <nav className="space-y-1.5">
              {navLinks.map((link) => {
                const isActive = checkIsActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, link.href)}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm transition-all flex items-center justify-between",
                      isActive
                        ? "bg-slate-950 text-white font-bold shadow-xs"
                        : "text-slate-700 font-semibold hover:bg-slate-100/80 hover:text-slate-950"
                    )}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Auth CTAs */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-2xl bg-[#0090AD] hover:bg-[#007A94] text-white text-sm font-bold text-center flex items-center justify-center shadow-md shadow-[#0090AD]/25 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <span>Open Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white text-sm font-bold text-center flex items-center justify-center shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/demo"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-2xl bg-[#0090AD] hover:bg-[#007A94] text-white text-sm font-bold text-center flex items-center justify-center shadow-md shadow-[#0090AD]/25 active:scale-[0.99] transition-all"
                  >
                    <span>Book Product Demo</span>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-sm font-bold text-center flex items-center justify-center transition-colors"
                  >
                    <span>Portal Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
