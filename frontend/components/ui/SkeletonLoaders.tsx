"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
  hasAvatar?: boolean;
}

/**
 * Skeleton table rows with realistic cell shimmer
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
  className,
  hasAvatar = true,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full divide-y divide-slate-100 overflow-hidden", className)}>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div
          key={rIdx}
          className="flex items-center gap-4 px-4 py-3.5 animate-pulse bg-white"
        >
          {hasAvatar && (
            <div className="w-8 h-8 rounded-full bg-slate-200/80 shrink-0" />
          )}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            <div className="space-y-1.5">
              <div className="h-3.5 bg-slate-200/90 rounded-md w-3/4" />
              <div className="h-2.5 bg-slate-100 rounded-md w-1/2" />
            </div>
            <div className="h-3 bg-slate-100 rounded-md w-2/3 hidden sm:block" />
            <div className="h-5 bg-slate-100/90 rounded-full w-20 hidden sm:block" />
            <div className="h-3 bg-slate-100 rounded-md w-16 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton card grid with realistic header, text, and footer placeholders
 */
export function CardGridSkeleton({ count = 4, className }: CardGridSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4 shadow-2xs animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-slate-200/80" />
            <div className="h-5 w-16 rounded-full bg-slate-100" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200/90 rounded-md w-2/3" />
            <div className="h-3 bg-slate-100 rounded-md w-full" />
            <div className="h-3 bg-slate-100 rounded-md w-4/5" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <div className="h-3 bg-slate-100 rounded-md w-24" />
            <div className="h-3 bg-slate-200/80 rounded-md w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface StatsRowSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * Skeleton metrics strip for dashboard overview
 */
export function StatsRowSkeleton({ count = 4, className }: StatsRowSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-2xs animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 bg-slate-200/80 rounded-md w-24" />
            <div className="w-7 h-7 rounded-lg bg-slate-100" />
          </div>
          <div className="h-7 bg-slate-200/90 rounded-md w-16" />
          <div className="h-2.5 bg-slate-100 rounded-md w-32" />
        </div>
      ))}
    </div>
  );
}
