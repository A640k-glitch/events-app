"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AppleSpinner from "@/components/ui/AppleSpinner";

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "secondaryDark" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function BrandButton({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}: BrandButtonProps) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-4.5 py-2 text-xs font-medium gap-2",
    lg: "px-6 py-2.5 text-sm font-medium gap-2.5",
  };

  const variantClasses = {
    // Primary Solid Action (Clean Teal with Deep Contrast Text)
    primary:
      "bg-[#00B4D8] hover:bg-[#0096C7] text-[#03045E] font-semibold border border-transparent shadow-xs transition-colors active:scale-[0.99]",
    
    // Clean Dark Button (for light pages)
    secondaryDark:
      "bg-[#111827] hover:bg-[#1F2937] text-white font-medium border border-transparent shadow-xs transition-colors active:scale-[0.99]",

    // Secondary / Subtle Button
    secondary:
      "bg-white/5 hover:bg-white/10 text-white font-medium border border-white/[0.08] transition-colors active:scale-[0.99]",

    // Clean Hairline Outline
    outline:
      "bg-transparent hover:bg-gray-50 text-[#111827] font-medium border border-gray-200 transition-colors active:scale-[0.99]",

    // Ghost Text Button
    ghost:
      "bg-transparent hover:bg-gray-100 text-[#4B5563] hover:text-[#111827] font-medium transition-colors",

    // Danger Button
    danger:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium border border-rose-500/20 transition-colors",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none font-sans",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <AppleSpinner size={14} color="currentColor" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
