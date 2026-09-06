"use client";

import { useEffect } from "react";

/**
 * Universal body scroll lock hook.
 * Prevents background scrolling on desktop, iOS Safari, Android, and tablets when a modal/menu is open.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}
