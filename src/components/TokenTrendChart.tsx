'use client';

import React, { useState } from 'react';
import { formatNumber, formatCurrency } from '@/lib/utils';

interface TrendDataPoint {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cacheTokens: number;
  cost: number;
  requests: number;
}

interface TokenTrendChartProps {
  data: TrendDataPoint[];
}

export function TokenTrendChart({ data }: TokenTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-emerald-400/60 text-sm">
        No trend telemetry collected for this period.
      </div>
    );
  }

  const maxTokens = Math.max(...data.map((d) => (d.inputTokens || 0) + (d.outputTokens || 0) + (d.cacheTokens || 0)), 1000);

  return (
    <div className="relative w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <span className="text-slate-200 font-medium">Input Tokens</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <span className="text-slate-200 font-medium">Output / Reasoning</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
          <span className="text-slate-200 font-medium">Cached Prompt Tokens</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto text-emerald-400 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Burn Trajectory</span>
        </div>
      </div>

      {/* Bar Chart Canvas */}
      <div className="h-56 flex items-end gap-2 pt-6 pb-2 border-b border-emerald-500/15">
        {data.map((point, idx) => {
          const total = (point.inputTokens || 0) + (point.outputTokens || 0) + (point.cacheTokens || 0);
          const heightPercent = Math.min(100, Math.max(8, (total / maxTokens) * 100));

          const inputH = total > 0 ? (point.inputTokens / total) * 100 : 33;
          const outputH = total > 0 ? (point.outputTokens / total) * 100 : 33;
          const cacheH = total > 0 ? (point.cacheTokens / total) * 100 : 34;

          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={point.date}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-28 z-50 bg-[#0c1410]/98 border border-emerald-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl text-[11px] min-w-[185px] pointer-events-none transition-all space-y-1">
                  <p className="font-bold text-white border-b border-emerald-500/20 pb-1 font-mono">
                    {point.date}
                  </p>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>Input:</span>
                    </span>
                    <span className="text-indigo-300 font-mono font-bold">{formatNumber(point.inputTokens)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Output:</span>
                    </span>
                    <span className="text-amber-300 font-mono font-bold">{formatNumber(point.outputTokens)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Cache:</span>
                    </span>
                    <span className="text-emerald-300 font-mono font-bold">{formatNumber(point.cacheTokens)}</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-300 font-semibold pt-1 border-t border-emerald-500/20 mt-1">
                    <span>Est. Cost:</span>
                    <span className="font-mono font-bold text-emerald-400">{formatCurrency(point.cost)}</span>
                  </div>
                </div>
              )}

              {/* Stacked Bar with High-Contrast Colors & Segment Definition */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[28px] rounded-t-lg flex flex-col overflow-hidden transition-all duration-300 border border-emerald-500/30 ${
                  isHovered ? 'scale-105 shadow-xl shadow-emerald-500/40 brightness-110' : 'opacity-95'
                }`}
              >
                {cacheH > 0 && (
                  <div 
                    style={{ height: `${cacheH}%` }} 
                    className="w-full bg-emerald-400 shadow-inner" 
                    title={`Cache Read Tokens: ${formatNumber(point.cacheTokens)}`}
                  />
                )}
                {outputH > 0 && (
                  <div 
                    style={{ height: `${outputH}%` }} 
                    className="w-full bg-amber-500 shadow-inner border-t border-amber-400/30" 
                    title={`Output / Reasoning: ${formatNumber(point.outputTokens)}`}
                  />
                )}
                {inputH > 0 && (
                  <div 
                    style={{ height: `${inputH}%` }} 
                    className="w-full bg-indigo-500 shadow-inner border-t border-indigo-400/30" 
                    title={`Input Prompt Tokens: ${formatNumber(point.inputTokens)}`}
                  />
                )}
              </div>

              {/* X Axis Label */}
              <span className="text-[10px] text-slate-400 mt-2 font-mono truncate max-w-full font-medium">
                {point.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
