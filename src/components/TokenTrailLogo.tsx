'use client';

import React from 'react';

interface TokenTrailLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function TokenTrailLogo({ size = 32, className = '', showText = false }: TokenTrailLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Brand Mark */}
      <div 
        style={{ width: size, height: size }} 
        className="relative shrink-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]"
        >
          <defs>
            <linearGradient id="tokenTrailGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="tokenTrailGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <radialGradient id="tokenTrailGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Hexagonal Node Container Background */}
          <rect width="40" height="40" rx="12" fill="#060f0a" />
          <rect width="40" height="40" rx="12" stroke="url(#tokenTrailGrad1)" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Ambient center pulse */}
          <circle cx="20" cy="20" r="10" fill="url(#tokenTrailGlow)" />

          {/* Intersecting Trail Ribbon (Token Infinity Loop / Pulse Trail) */}
          <path
            d="M10 20 C 10 13, 17 11, 22 15 L 28 20 C 33 24, 30 30, 24 29 C 18 28, 15 22, 20 18"
            stroke="url(#tokenTrailGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 20 C 30 27, 23 29, 18 25 L 12 20 C 7 16, 10 10, 16 11 C 22 12, 25 18, 20 22"
            stroke="url(#tokenTrailGrad2)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.85"
          />

          {/* Data Spark Tokens (Trail Nodes) */}
          <circle cx="12" cy="18" r="2" fill="#34d399" />
          <circle cx="28" cy="22" r="2" fill="#2dd4bf" />
          <circle cx="20" cy="20" r="2.5" fill="#ffffff" className="animate-pulse" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="text-lg font-extrabold tracking-tight flex items-center leading-none">
            <span className="text-white">Token</span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Trail
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider mt-0.5 font-medium">
            AI Observability
          </span>
        </div>
      )}
    </div>
  );
}
