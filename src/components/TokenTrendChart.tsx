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
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-slate-300">Input Tokens</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-teal-400" />
          <span className="text-slate-300">Output / Reasoning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-cyan-400" />
          <span className="text-slate-300">Cached Prompt Tokens</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Cost Burn Rate</span>
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
                <div className="absolute -top-24 z-50 bg-[#0c1410]/95 border border-emerald-500/40 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-[11px] min-w-[170px] pointer-events-none transition-all">
                  <p className="font-semibold text-emerald-200 border-b border-emerald-500/20 pb-1 mb-1 font-mono">
                    {point.date}
                  </p>
                  <div className="flex justify-between text-slate-400">
                    <span>Input:</span>
                    <span className="text-emerald-300 font-mono">{formatNumber(point.inputTokens)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Output:</span>
                    <span className="text-teal-300 font-mono">{formatNumber(point.outputTokens)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cache:</span>
                    <span className="text-cyan-300 font-mono">{formatNumber(point.cacheTokens)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold pt-1 border-t border-emerald-500/20 mt-1">
                    <span>Est. Cost:</span>
                    <span className="font-mono">{formatCurrency(point.cost)}</span>
                  </div>
                </div>
              )}

              {/* Stacked Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[28px] rounded-t-lg flex flex-col overflow-hidden transition-all duration-300 ${
                  isHovered ? 'scale-105 shadow-lg shadow-emerald-500/30 brightness-110' : 'opacity-85'
                }`}
              >
                <div style={{ height: `${cacheH}%` }} className="w-full bg-cyan-400" />
                <div style={{ height: `${outputH}%` }} className="w-full bg-teal-400" />
                <div style={{ height: `${inputH}%` }} className="w-full bg-emerald-500" />
              </div>

              {/* X Axis Label */}
              <span className="text-[10px] text-emerald-400/60 mt-2 font-mono truncate max-w-full">
                {point.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
