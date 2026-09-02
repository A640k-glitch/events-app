"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ArrowRight, LayoutDashboard, LogIn } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import FifthEventsLogo from "@/components/brand/FifthEventsLogo";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll);
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
      {/* Mobile Backdrop when menu is open */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Floating Frosted Liquid Glass Navbar */}
      <header
        className={cn(
          "fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-6xl z-50 transition-all duration-300",
          "bg-white/90 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_0_rgba(17,24,39,0.08)]",
          mobileMenuOpen ? "rounded-3xl p-4 sm:p-6 shadow-2xl bg-white/95" : "rounded-full py-2.5 sm:py-3 px-4 sm:px-7",
          scrolled && !mobileMenuOpen ? "py-2 sm:py-2.5 shadow-[0_12px_40px_0_rgba(17,24,39,0.12)]" : ""
        )}
        style={{
          boxShadow: mobileMenuOpen 
            ? "0 20px 40px 0 rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.9)"
            : "0 8px 32px 0 rgba(0, 144, 173, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          
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
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-xs font-semibold transition-all relative py-1",
                    isActive
                      ? "text-[#0090AD]"
                      : "text-gray-600 hover:text-[#111827]"
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
                    className="px-4 py-2 rounded-full text-xs font-semibold bg-[#111827] text-white hover:bg-black transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Console
                  </Link>
                  <button
                    onClick={logout}
                    title="Sign Out"
                    className="p-2 rounded-full text-gray-500 hover:text-rose-600 hover:bg-rose-50/80 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 rounded-full text-xs font-semibold text-gray-700 hover:text-[#111827] hover:bg-gray-100/70 transition-colors"
                  >
                    Portal Login
                  </Link>

                  <Link
                    href="/demo"
                    className="px-4 sm:px-5 py-2 rounded-full text-xs font-semibold bg-[#0090AD] text-white hover:bg-[#007A94] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                  >
                    <span>Book Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger / Close Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-gray-950 md:hidden rounded-full hover:bg-gray-100/90 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Expanded Menu Deck */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100/90 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-colors flex items-center justify-between",
                    isActive
                      ? "bg-[#E8F8FA] text-[#00829B]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-950"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0090AD]" />}
                </Link>
              );
            })}

            {/* Mobile Auth CTAs */}
            <div className="pt-3 mt-2 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-2xl bg-[#111827] text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Operations Console</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl border border-gray-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
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
                    className="w-full py-3 px-4 rounded-2xl bg-[#0090AD] hover:bg-[#007A94] text-white text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Book Product Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-2xl border border-gray-200 text-gray-800 hover:bg-gray-50 text-xs font-semibold text-center flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-3.5 h-3.5" />
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
