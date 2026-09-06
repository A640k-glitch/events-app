import React from "react";
import { cn } from "@/lib/utils";

interface FifthEventsWordmarkProps {
  className?: string;
  theme?: "light" | "dark" | "auto";
  fifthClassName?: string;
  eventsClassName?: string;
}

/**
 * FifthEvents Official Text Wordmark
 * Displays "fifth" in bold brand cyan/teal and "Events" in light/thin weight.
 * Automatically adapts colors based on light or dark background.
 */
export default function FifthEventsWordmark({
  className,
  theme = "light",
  fifthClassName,
  eventsClassName,
}: FifthEventsWordmarkProps) {
  const isDark = theme === "dark";

  return (
    <span className={cn("inline-flex items-baseline tracking-tight font-sans select-none", className)}>
      <span
        className={cn(
          "font-bold",
          isDark ? "text-[#00B4D8]" : "text-[#0090AD]",
          fifthClassName
        )}
      >
        fifth
      </span>
      <span
        className={cn(
          "font-light",
          isDark ? "text-white" : "text-[#1C1852]",
          eventsClassName
        )}
      >
        Events
      </span>
    </span>
  );
}
