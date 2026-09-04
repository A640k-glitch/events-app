"use client";

import React from "react";
import AppleSpinner from "@/components/ui/AppleSpinner";

interface LogoChargingLoaderProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
  size?: number;
}

/**
 * Standard FifthEvents Brand Loader
 * Uses authentic Apple spinner styled in FifthLab signature cyan (#0090AD)
 */
export default function LogoChargingLoader({
  message = "Loading...",
  className,
  fullScreen = false,
  size = 36,
}: LogoChargingLoaderProps) {
  return (
    <AppleSpinner
      size={size}
      color="#0090AD"
      message={message}
      className={className}
      fullScreen={fullScreen}
    />
  );
}
