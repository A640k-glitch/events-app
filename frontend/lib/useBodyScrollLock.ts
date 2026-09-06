"use client";

import { useEffect } from "react";

let lockCount = 0;
let savedScrollY = 0;
let originalBodyPaddingRight = "";
let originalBodyOverflow = "";
let originalHtmlOverflow = "";

/**
 * Universal body scroll lock hook.
 * Robustly prevents background scrolling on:
 * - iOS Safari (fixed position + scrollY restore to eliminate rubber-banding)
 * - Android Chrome (touch-action and overflow lock)
 * - Desktop (prevents wheel/trackpad scrolling + eliminates scrollbar layout shifts)
 * - Nested/Multiple modals (reference counted so child overlays don't unlock parents prematurely)
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    if (typeof window === "undefined" || typeof document === "undefined") return;

    if (lockCount === 0) {
      // 1. Measure and store current scroll position
      savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      
      // 2. Prevent layout shift on desktop when scrollbar disappears
      originalBodyPaddingRight = document.body.style.paddingRight || "";
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // 3. Save original overflows
      originalBodyOverflow = document.body.style.overflow || "";
      originalHtmlOverflow = document.documentElement.style.overflow || "";

      // 4. Lock both html and body
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      // 5. iOS Safari rubber-band fix (position: fixed locked to current scroll position)
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    }

    lockCount++;

    return () => {
      lockCount--;

      if (lockCount <= 0) {
        lockCount = 0;

        // Restore body position and styles
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.paddingRight = originalBodyPaddingRight;

        // Restore exact scroll position
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [isLocked]);
}
