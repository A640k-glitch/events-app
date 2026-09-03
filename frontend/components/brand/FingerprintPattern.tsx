import React from "react";

interface FingerprintPatternProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export default function FingerprintPattern({
  className = "",
  size = 420,
  opacity = 0.15,
}: FingerprintPatternProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* Core loops and whorls */}
        <path d="M100 86 C94 86 90 91 90 97 C90 106 100 114 100 120" />
        <path d="M100 78 C88 78 82 86 82 96 C82 110 94 122 98 132" />
        <path d="M100 70 C82 70 74 81 74 96 C74 116 88 132 94 144" />
        <path d="M100 62 C76 62 66 76 66 96 C66 122 82 142 90 156" />
        <path d="M100 54 C70 54 58 71 58 96 C58 128 76 152 86 168" />
        <path d="M100 46 C64 46 50 66 50 96 C50 134 70 162 82 180" />
        <path d="M100 38 C58 38 42 61 42 96 C42 140 64 172 78 192" />
        
        {/* Outer and right concentric ridges */}
        <path d="M100 86 C106 86 110 91 110 97 C110 107 104 115 102 124" />
        <path d="M100 78 C112 78 118 86 118 96 C118 112 108 123 104 135" />
        <path d="M100 70 C118 70 126 81 126 96 C126 118 112 133 106 147" />
        <path d="M100 62 C124 62 134 76 134 96 C134 124 116 143 108 159" />
        <path d="M100 54 C130 54 142 71 142 96 C142 130 120 153 110 171" />
        <path d="M100 46 C136 46 150 66 150 96 C150 136 124 163 112 183" />
        <path d="M100 38 C142 38 158 61 158 96 C158 142 128 173 114 195" />

        {/* Cryptographic delta loops */}
        <path d="M34 110 C34 78 48 50 72 32 C82 24 91 22 100 22 C109 22 118 24 128 32 C152 50 166 78 166 110" strokeDasharray="3 3" />
        <path d="M26 120 C26 72 44 40 70 20 C80 12 90 10 100 10 C110 10 120 12 130 20 C156 40 174 72 174 120" />
      </g>
    </svg>
  );
}
