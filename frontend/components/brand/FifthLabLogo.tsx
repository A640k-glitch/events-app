import React from "react";

interface FifthLabLogoProps {
  className?: string;
  size?: number;
  height?: number;
  width?: number;
  theme?: string;
  alt?: string;
}

export default function FifthLabLogo({
  className = "",
  size,
  height,
  width,
  alt = "fifthlab",
}: FifthLabLogoProps) {
  const h = height || size || 32;

  return (
    <img
      src="/favicon.ico"
      alt={alt}
      height={h}
      width={width}
      className={`shrink-0 select-none object-contain ${className}`}
      style={{ height: `${h}px`, width: width ? `${width}px` : "auto" }}
    />
  );
}
