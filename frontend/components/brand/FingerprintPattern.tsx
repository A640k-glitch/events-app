import React from "react";

interface FingerprintPatternProps {
  className?: string;
  size?: number;
  opacity?: number;
  strokeWidth?: number;
  variant?: "loop" | "whorl";
}

/**
 * Ultra-dense biometric fingerprint pattern with tightly packed ridges,
 * organic dermal curvature, core loops, and cryptographic dashed scanlines.
 */
export default function FingerprintPattern({
  className = "",
  size = 480,
  opacity = 0.3,
  strokeWidth = 1.2,
  variant = "loop",
}: FingerprintPatternProps) {
  const cx = 150;
  const cy = 200;
  const totalRidges = 42;

  // Pre-calculate 40+ ultra-dense concentric ridges (tight ~3.1px spacing)
  const ridges = [];
  for (let i = 4; i <= totalRidges; i++) {
    const rx = 6 + (i - 3) * 3.1;
    const ry = 10 + (i - 3) * 3.8;

    const leftX = cx - rx;
    const rightX = cx + rx * 1.08;
    const topY = cy - ry;

    // Bottom endpoints extending downward naturally
    const leftBottomY = cy + Math.min(ry * 0.72 + i * 0.8, 125);
    const rightBottomY = cy + Math.min(ry * 0.88 + i * 1.05, 145);

    // Natural biometric asymmetry & organic control curves
    const cp1x = leftX - i * 0.1;
    const cp1y = cy - ry * 0.25;
    const cp2x = cx - rx * 0.62;
    const cp2y = topY;

    const cp3x = cx + rx * 0.65;
    const cp3y = topY;
    const cp4x = rightX + i * 0.12;
    const cp4y = cy - ry * 0.2;

    const isDashed = i === 15 || i === 27 || i === 37;
    const dashArray = isDashed 
      ? (i === 15 ? "5 3.5" : i === 27 ? "7 4" : "9 5") 
      : undefined;

    ridges.push({
      d: `M ${leftX.toFixed(1)} ${leftBottomY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${cx.toFixed(1)} ${topY.toFixed(1)} C ${cp3x.toFixed(1)} ${cp3y.toFixed(1)}, ${cp4x.toFixed(1)} ${cp4y.toFixed(1)}, ${rightX.toFixed(1)} ${rightBottomY.toFixed(1)}`,
      dashArray,
      key: `ridge-${i}`,
    });
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none shrink-0 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Central Core Whorl Loops (Ultra-tight Hairpin Center) */}
        <path d="M 150 200 C 147 196 147 185 150 183 C 153 185 153 196 150 205" />
        <path d="M 147 208 C 143 201 143 179 150 177 C 157 179 157 201 153 211" />
        <path d="M 144 214 C 139 205 139 174 150 171 C 161 174 161 205 156 217" />
        <path d="M 141 219 C 135 209 135 169 150 166 C 165 169 165 209 159 223" />

        {/* 38 Dense Concentric Dermal Ridges */}
        {ridges.map((r) => (
          <path
            key={r.key}
            d={r.d}
            strokeDasharray={r.dashArray}
          />
        ))}

        {/* Outer Biometric Delta Loop Ridges (Lower Left) */}
        <path
          d="M 38 230 C 58 210, 85 220, 110 240"
          strokeDasharray="5 4"
        />
        <path d="M 28 245 C 55 225, 90 238, 120 255" />
        <path d="M 18 260 C 50 240, 95 255, 130 270" />
        <path d="M 8 275 C 45 255, 100 270, 140 285" />
        <path d="M 0 290 C 40 270, 105 285, 150 300" strokeDasharray="6 4" />

        {/* Biometric Flank Contours (Upper Left) */}
        <path
          d="M 22 170 C 45 130, 80 100, 120 80"
          strokeDasharray="6 4"
        />
        <path d="M 32 155 C 55 120, 90 92, 130 74" />
        <path d="M 42 140 C 65 110, 100 84, 140 68" />
      </g>
    </svg>
  );
}
