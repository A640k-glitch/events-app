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

  // Lock background scroll when mobile navigation modal is open
  useBodyScrollLock(mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Events", href: "/events" },
    { name: "Leads", href: "/#solutions" },
    { name: "Products", href: "/#products" },
    { name: "About", href: "/#about" },
  ];

  return (
    <>
      {/* Mobile Modal Drawer Overlay with zero-lag smooth presentation */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden flex items-center justify-center p-4"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-6 text-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Logo & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <FifthEventsLogo size={26} theme="light" showSubtitle={true} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-xs font-semibold transition-colors flex items-center justify-between",
                      isActive
                        ? "bg-[#E8F8FA] text-[#00829B] font-bold"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <span>{link.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#0090AD]" />}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Auth Actions */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-2xl bg-[#111827] text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs hover:bg-black transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Operations Console</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/demo"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0090AD] to-[#229EA6] hover:from-[#007A94] hover:to-[#1E8B92] text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-[#0090AD]/20 transition-all"
                  >
                    <span>Book Product Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold text-center flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Portal Login</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Stable Navbar Capsule */}
      <header
        className={cn(
          "fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-6xl z-40 transition-all duration-200",
          "bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(17,24,39,0.08)] rounded-full py-2.5 sm:py-3 px-4 sm:px-7",
          scrolled ? "shadow-[0_12px_40px_0_rgba(17,24,39,0.12)] py-2 sm:py-2.5" : ""
        )}
      >
        <div className="flex items-center justify-between gap-3">
          
          {/* 1. Left: Official FifthEvents Logo */}
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
            >
              <FifthEventsLogo size={26} theme="light" />
            </Link>
          </div>

          {/* 2. Middle: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
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

          {/* 3. Right: Desktop Auth Buttons + Mobile Hamburger Button */}
          <div className="flex items-center gap-2">
            
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-slate-900 text-white hover:bg-black transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Console
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

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 hover:text-slate-950 md:hidden rounded-full hover:bg-slate-100/90 transition-colors cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
