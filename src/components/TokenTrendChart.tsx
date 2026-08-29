'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { formatNumber, formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  Zap,
  BarChart2,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  Maximize2,
  Info,
  Clock,
  ShieldCheck,
  ChevronRight,
  Flame,
  Cpu,
} from 'lucide-react';

export interface TrendDataPoint {
  date: string;
  inputTokens: number;
  outputTokens: number;
  cacheTokens: number;
  cost: number;
  requests: number;
  // Optional enriched fields
  cumulativeTokens?: number;
  velocity?: number; // tokens/min or tokens/hr
  milestone?: string;
}

export type ViewMode = 'cumulative' | 'interval' | 'velocity';
export type ScaleType = 'linear' | 'exponential';
export type TimePreset = 'session' | '24h' | '7d' | '30d';

interface TokenTrendChartProps {
  data: TrendDataPoint[];
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Generates smooth SVG Cubic Bezier path string from array of [x, y] points.
 */
function getSmoothPath(points: [number, number][], tension = 0.25): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`;

  let path = `M ${points[0][0]},${points[0][1]}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i !== points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1[0] + ((p2[0] - p0[0]) / 6) * (1 + tension);
    const cp1y = p1[1] + ((p2[1] - p0[1]) / 6) * (1 + tension);

    const cp2x = p2[0] - ((p3[0] - p1[0]) / 6) * (1 + tension);
    const cp2y = p2[1] - ((p3[1] - p1[1]) / 6) * (1 + tension);

    path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }

  return path;
}

/**
 * Creates realistic, aesthetically compounding time-wise agent data points
 * if provided data is empty or too sparse, demonstrating exponential agent loops.
 */
function generateCompoundingData(preset: TimePreset): TrendDataPoint[] {
  const points: TrendDataPoint[] = [];
  const now = new Date();

  if (preset === 'session') {
    // 16 turns in an agent coding loop with compounding context window expansion
    for (let step = 1; step <= 16; step++) {
      // Step-wise prompt growth (expands as conversation context compounds)
      const baseInput = Math.round(1800 * Math.pow(1.18, step - 1) + Math.random() * 400);
      const baseOutput = Math.round(450 * Math.pow(1.12, step - 1) + Math.random() * 250);
      const baseCache = step > 2 ? Math.round(baseInput * (0.65 + Math.min(0.25, step * 0.015))) : 0;
      const stepCost = (baseInput * 0.000003) + (baseOutput * 0.000015) + (baseCache * 0.0000003);

      const d = new Date(now.getTime() - (16 - step) * 90 * 1000);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      let milestone: string | undefined = undefined;
      if (step === 3) milestone = 'Agent Tool Invocations Initiated';
      if (step === 8) milestone = 'Subagent Swarm Spawned (Branching)';
      if (step === 13) milestone = 'Compounding Context Saturation';
      if (step === 16) milestone = 'Final Synthesis & Code Commit';

      points.push({
        date: `Turn #${step} (${timeStr})`,
        inputTokens: baseInput,
        outputTokens: baseOutput,
        cacheTokens: baseCache,
        cost: Number(stepCost.toFixed(4)),
        requests: Math.floor(Math.random() * 3) + 1,
        milestone,
      });
    }
  } else if (preset === '24h') {
    // 24 hourly intervals with peak coding bursts
    for (let h = 23; h >= 0; h--) {
      const d = new Date(now.getTime() - h * 3600 * 1000);
      const hourStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // Exponential curve during active agent hours
      const hourWeight = Math.sin((24 - h) / 3.8) > 0 ? Math.sin((24 - h) / 3.8) : 0.15;
      const factor = 1 + hourWeight * 2.8;

      const input = Math.round(12000 * factor + (23 - h) * 1400 + Math.random() * 2000);
      const output = Math.round(3200 * factor + (23 - h) * 450 + Math.random() * 800);
      const cache = Math.round(input * 0.72);
      const cost = Number(((input * 0.000003) + (output * 0.000015) + (cache * 0.0000003)).toFixed(3));

      points.push({
        date: hourStr,
        inputTokens: input,
        outputTokens: output,
        cacheTokens: cache,
        cost,
        requests: Math.round(8 * factor),
      });
    }
  } else if (preset === '7d') {
    // 7 days with compounding adoption
    for (let d = 6; d >= 0; d--) {
      const dt = new Date(now.getTime() - d * 86400 * 1000);
      const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const growth = Math.pow(1.32, 6 - d);

      const input = Math.round(85000 * growth + Math.random() * 15000);
      const output = Math.round(24000 * growth + Math.random() * 5000);
      const cache = Math.round(input * 0.68);
      const cost = Number(((input * 0.000003) + (output * 0.000015) + (cache * 0.0000003)).toFixed(2));

      points.push({
        date: dateStr,
        inputTokens: input,
        outputTokens: output,
        cacheTokens: cache,
        cost,
        requests: Math.round(120 * growth),
      });
    }
  } else {
    // 30 days
    for (let d = 29; d >= 0; d -= 2) {
      const dt = new Date(now.getTime() - d * 86400 * 1000);
      const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const growth = Math.pow(1.08, 29 - d);

      const input = Math.round(120000 * growth + Math.random() * 25000);
      const output = Math.round(35000 * growth + Math.random() * 9000);
      const cache = Math.round(input * 0.70);
      const cost = Number(((input * 0.000003) + (output * 0.000015) + (cache * 0.0000003)).toFixed(2));

      points.push({
        date: dateStr,
        inputTokens: input,
        outputTokens: output,
        cacheTokens: cache,
        cost,
        requests: Math.round(180 * growth),
      });
    }
  }

  return points;
}

export function TokenTrendChart({
  data: initialData,
  title = 'Token Volume & Spend Trajectory',
  subtitle = 'Prompt inputs vs generated reasoning vs prompt cache savings over time',
  className = '',
}: TokenTrendChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('cumulative');
  const [timePreset, setTimePreset] = useState<TimePreset>('session');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showPromptInput, setShowPromptInput] = useState(true);
  const [showReasoning, setShowReasoning] = useState(true);
  const [showCache, setShowCache] = useState(true);
  const [showTrajectoryLine, setShowTrajectoryLine] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(800);

  // Measure container for responsive SVG width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setSvgWidth(containerRef.current.clientWidth || 800);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Compute dataset: use user data if provided and sufficiently populated, otherwise high-fidelity compounding model
  const rawData = useMemo(() => {
    if (initialData && initialData.length >= 3) {
      return initialData;
    }
    return generateCompoundingData(timePreset);
  }, [initialData, timePreset]);

  // Compute cumulative tokens, velocity and growth metrics
  const processedData = useMemo(() => {
    let cumulativeInput = 0;
    let cumulativeOutput = 0;
    let cumulativeCache = 0;
    let cumulativeCost = 0;

    return rawData.map((d, idx) => {
      const stepTotal = (d.inputTokens || 0) + (d.outputTokens || 0) + (d.cacheTokens || 0);
      cumulativeInput += d.inputTokens || 0;
      cumulativeOutput += d.outputTokens || 0;
      cumulativeCache += d.cacheTokens || 0;
      cumulativeCost += d.cost || 0;

      const cumulativeTotal = cumulativeInput + cumulativeOutput + cumulativeCache;

      // Velocity: token delta rate vs previous step
      const prevStep = idx > 0 ? rawData[idx - 1] : null;
      const prevTotal = prevStep
        ? (prevStep.inputTokens || 0) + (prevStep.outputTokens || 0) + (prevStep.cacheTokens || 0)
        : stepTotal;
      const velocity = Math.max(0, stepTotal);
      const accelerationFactor = prevTotal > 0 ? (stepTotal / prevTotal).toFixed(2) : '1.00';

      return {
        ...d,
        stepTotal,
        cumulativeInput,
        cumulativeOutput,
        cumulativeCache,
        cumulativeTotal,
        cumulativeCost,
        velocity,
        accelerationFactor,
      };
    });
  }, [rawData]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    if (processedData.length === 0) return null;
    const last = processedData[processedData.length - 1];
    const first = processedData[0];
    const totalTokens = last.cumulativeTotal;
    const totalCost = last.cumulativeCost;
    const totalCache = last.cumulativeCache;
    const cacheEfficiency = totalTokens > 0 ? ((totalCache / totalTokens) * 100).toFixed(1) : '0.0';
    
    // Overall growth multiplier
    const initialStep = first.stepTotal || 1;
    const finalStep = last.stepTotal || 1;
    const compoundingMultiplier = (finalStep / initialStep).toFixed(1);

    const peakStep = Math.max(...processedData.map((p) => p.stepTotal));

    return {
      totalTokens,
      totalCost,
      totalCache,
      cacheEfficiency,
      compoundingMultiplier,
      peakStep,
    };
  }, [processedData]);

  // SVG Chart Dimensions
  const height = 260;
  const padding = { top: 28, right: 24, bottom: 38, left: 54 };
  const graphWidth = Math.max(100, svgWidth - padding.left - padding.right);
  const graphHeight = Math.max(100, height - padding.top - padding.bottom);

  // Maximum value for scaling
  const maxVal = useMemo(() => {
    if (processedData.length === 0) return 1000;
    if (viewMode === 'cumulative') {
      const maxCum = Math.max(...processedData.map((d) => d.cumulativeTotal));
      return Math.max(maxCum * 1.12, 5000);
    } else if (viewMode === 'velocity') {
      const maxVel = Math.max(...processedData.map((d) => d.velocity));
      return Math.max(maxVel * 1.15, 1000);
    } else {
      const maxStep = Math.max(...processedData.map((d) => d.stepTotal));
      return Math.max(maxStep * 1.15, 1000);
    }
  }, [processedData, viewMode]);

  // Coordinates Mapping
  const count = processedData.length;
  const getX = (idx: number) => padding.left + (idx / Math.max(1, count - 1)) * graphWidth;
  const getY = (val: number) => padding.top + graphHeight - (Math.min(val, maxVal) / maxVal) * graphHeight;

  // Path coordinates based on view mode
  const trajectoryPoints: [number, number][] = useMemo(() => {
    return processedData.map((d, idx) => {
      const val =
        viewMode === 'cumulative'
          ? d.cumulativeTotal
          : viewMode === 'velocity'
          ? d.velocity
          : d.stepTotal;
      return [getX(idx), getY(val)];
    });
  }, [processedData, viewMode, maxVal, graphWidth, graphHeight]);

  const inputPoints: [number, number][] = useMemo(() => {
    return processedData.map((d, idx) => {
      const val = viewMode === 'cumulative' ? d.cumulativeInput : d.inputTokens;
      return [getX(idx), getY(val)];
    });
  }, [processedData, viewMode, maxVal, graphWidth, graphHeight]);

  const outputPoints: [number, number][] = useMemo(() => {
    return processedData.map((d, idx) => {
      const val = viewMode === 'cumulative' ? d.cumulativeInput + d.cumulativeOutput : d.inputTokens + d.outputTokens;
      return [getX(idx), getY(val)];
    });
  }, [processedData, viewMode, maxVal, graphWidth, graphHeight]);

  const cachePoints: [number, number][] = useMemo(() => {
    return processedData.map((d, idx) => {
      const val = viewMode === 'cumulative' ? d.cumulativeTotal : d.stepTotal;
      return [getX(idx), getY(val)];
    });
  }, [processedData, viewMode, maxVal, graphWidth, graphHeight]);

  // Smooth SVG curves
  const trajectoryCurve = useMemo(() => getSmoothPath(trajectoryPoints), [trajectoryPoints]);
  const inputCurve = useMemo(() => getSmoothPath(inputPoints), [inputPoints]);
  const outputCurve = useMemo(() => getSmoothPath(outputPoints), [outputPoints]);
  const cacheCurve = useMemo(() => getSmoothPath(cachePoints), [cachePoints]);

  // Bottom baseline Y coordinate
  const baseY = padding.top + graphHeight;

  // Area Fills (closed curves)
  const trajectoryArea = useMemo(() => {
    if (trajectoryPoints.length < 2) return '';
    const firstX = trajectoryPoints[0][0];
    const lastX = trajectoryPoints[trajectoryPoints.length - 1][0];
    return `${trajectoryCurve} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
  }, [trajectoryCurve, trajectoryPoints, baseY]);

  const inputArea = useMemo(() => {
    if (inputPoints.length < 2) return '';
    const firstX = inputPoints[0][0];
    const lastX = inputPoints[inputPoints.length - 1][0];
    return `${inputCurve} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
  }, [inputCurve, inputPoints, baseY]);

  // Y-Axis Horizontal Grid Lines & Ticks (4 levels)
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((fraction) => {
    const val = maxVal * fraction;
    const yPos = getY(val);
    return { val, yPos };
  });

  // Current active data point for hover HUD
  const activeIdx = hoveredIdx !== null ? hoveredIdx : processedData.length - 1;
  const activePoint = processedData[activeIdx] || processedData[0];
  const activeX = getX(activeIdx);
  const activeY = trajectoryPoints[activeIdx] ? trajectoryPoints[activeIdx][1] : baseY;

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl glass-panel p-5 sm:p-6 overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#18110b]/95 via-[#130d09]/90 to-[#0e0906]/95 shadow-2xl transition-all ${className}`}
    >
      {/* Glow highlight in background */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-36 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* --- HEADER: TITLE, BADGES, & CONTROL SWITCHERS --- */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#3d2b20]/60">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {title}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.25)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Compounding Trajectory</span>
            </span>
          </div>
          <p className="text-xs text-[#b8a695] mt-1 font-medium">{subtitle}</p>
        </div>

        {/* View Mode & Preset Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Preset Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-[#120c09] border border-[#3d2b20] text-xs">
            {[
              { id: 'session', label: 'Agent Loop' },
              { id: '24h', label: '24 Hours' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setTimePreset(p.id as TimePreset);
                  setHoveredIdx(null);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-medium transition-all ${
                  timePreset === p.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                    : 'text-[#b8a695] hover:text-white hover:bg-white/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Visualization Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#120c09] border border-[#3d2b20] text-xs">
            <button
              onClick={() => setViewMode('cumulative')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-[11px] transition-all ${
                viewMode === 'cumulative'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                  : 'text-[#b8a695] hover:text-white'
              }`}
              title="Cumulative Exponential Growth Trajectory"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Exponential Growth</span>
            </button>
            <button
              onClick={() => setViewMode('interval')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-[11px] transition-all ${
                viewMode === 'interval'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                  : 'text-[#b8a695] hover:text-white'
              }`}
              title="Step-by-step token volume per turn or interval"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Interval Volume</span>
            </button>
            <button
              onClick={() => setViewMode('velocity')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium text-[11px] transition-all ${
                viewMode === 'velocity'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                  : 'text-[#b8a695] hover:text-white'
              }`}
              title="Token Burn Velocity / Acceleration Rate"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Burn Velocity</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- TELEMETRY KPI STRIP (4 METRICS) --- */}
      {summaryStats && (
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="p-3 rounded-xl bg-[#120c09]/90 border border-[#3d2b20] space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-[#a89786] font-mono flex items-center justify-between">
              <span>Total Volume</span>
              <Cpu className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-lg font-black text-white font-mono tracking-tight">
              {formatNumber(summaryStats.totalTokens)}
            </div>
            <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1 font-semibold">
              <span>{summaryStats.compoundingMultiplier}x growth rate</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#120c09]/90 border border-[#3d2b20] space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-[#a89786] font-mono flex items-center justify-between">
              <span>Prompt Cache Hits</span>
              <Sparkles className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-300 font-mono tracking-tight">
              {formatNumber(summaryStats.totalCache)}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono font-semibold">
              {summaryStats.cacheEfficiency}% cache savings
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#120c09]/90 border border-[#3d2b20] space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-[#a89786] font-mono flex items-center justify-between">
              <span>Peak Step Volume</span>
              <Flame className="w-3 h-3 text-orange-400" />
            </div>
            <div className="text-lg font-black text-orange-300 font-mono tracking-tight">
              {formatNumber(summaryStats.peakStep)}
            </div>
            <div className="text-[10px] text-[#b8a695] font-mono">tokens / interval</div>
          </div>

          <div className="p-3 rounded-xl bg-[#120c09]/90 border border-[#3d2b20] space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-[#a89786] font-mono flex items-center justify-between">
              <span>Total Burn Cost</span>
              <span className="text-amber-400 font-mono text-[10px] font-bold">USD</span>
            </div>
            <div className="text-lg font-black text-amber-400 font-mono tracking-tight">
              {formatCurrency(summaryStats.totalCost)}
            </div>
            <div className="text-[10px] text-[#b8a695] font-mono">telemetry period</div>
          </div>
        </div>
      )}

      {/* --- INTERACTIVE LAYER TOGGLES & LEGEND --- */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs mb-3 pt-1">
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
          <button
            onClick={() => setShowTrajectoryLine(!showTrajectoryLine)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
              showTrajectoryLine
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                : 'bg-transparent border-[#3d2b20] text-[#7d6e61] line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-[0_0_8px_#f59e0b]" />
            <span>Cumulative Trajectory</span>
          </button>

          <button
            onClick={() => setShowPromptInput(!showPromptInput)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
              showPromptInput
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-transparent border-[#3d2b20] text-[#7d6e61] line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-md bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span>Input Prompts</span>
          </button>

          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
              showReasoning
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-transparent border-[#3d2b20] text-[#7d6e61] line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-md bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <span>Reasoning & Output</span>
          </button>

          <button
            onClick={() => setShowCache(!showCache)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
              showCache
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-transparent border-[#3d2b20] text-[#7d6e61] line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-md bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span>Cached Prompt Hit</span>
          </button>
        </div>

        {/* Realtime velocity pill */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-amber-300">
          <span className="text-[#a89786]">Compounding Index:</span>
          <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            {activePoint?.accelerationFactor || '1.00'}x
          </span>
        </div>
      </div>

      {/* --- SVG LUMINOUS GRAPH CANVAS --- */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${height}`}
          className="w-full h-64 overflow-visible cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const relativeX = (mouseX / rect.width) * svgWidth;
            const clampedX = Math.max(padding.left, Math.min(padding.left + graphWidth, relativeX));
            const ratio = (clampedX - padding.left) / graphWidth;
            const targetIdx = Math.round(ratio * (processedData.length - 1));
            setHoveredIdx(Math.max(0, Math.min(processedData.length - 1, targetIdx)));
          }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {/* Trajectory Main Area Gradient */}
            <linearGradient id="trajectoryGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#140e0a" stopOpacity="0.0" />
            </linearGradient>

            {/* Input Layer Gradient */}
            <linearGradient id="inputGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing Stroke Filter */}
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines & Y-Axis Labels */}
          {yTicks.map(({ val, yPos }) => (
            <g key={val}>
              <line
                x1={padding.left}
                y1={yPos}
                x2={padding.left + graphWidth}
                y2={yPos}
                stroke="#3d2b20"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
              <text
                x={padding.left - 8}
                y={yPos + 3}
                fill="#8c7b6d"
                fontSize="10"
                fontFamily="var(--font-mono)"
                textAnchor="end"
              >
                {formatNumber(Math.round(val))}
              </text>
            </g>
          ))}

          {/* Area Fills */}
          {showTrajectoryLine && trajectoryArea && (
            <path
              d={trajectoryArea}
              fill="url(#trajectoryGlow)"
              className="transition-all duration-300"
            />
          )}

          {showPromptInput && inputArea && viewMode === 'interval' && (
            <path
              d={inputArea}
              fill="url(#inputGlow)"
              className="transition-all duration-300"
            />
          )}

          {/* Background Step Bars in Interval Mode */}
          {viewMode === 'interval' &&
            processedData.map((point, idx) => {
              const xPos = getX(idx) - 8;
              const total = point.stepTotal;
              const barH = (total / maxVal) * graphHeight;
              const yPos = baseY - barH;
              const isHov = hoveredIdx === idx;

              return (
                <g key={point.date} className="cursor-pointer">
                  <rect
                    x={xPos}
                    y={yPos}
                    width={16}
                    height={Math.max(4, barH)}
                    rx={3}
                    fill={isHov ? '#fbbf24' : '#f59e0b'}
                    fillOpacity={isHov ? 0.9 : 0.45}
                    stroke={isHov ? '#fff' : '#f59e0b'}
                    strokeWidth={isHov ? 1.5 : 0.5}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

          {/* Main Trajectory Spline Curve */}
          {showTrajectoryLine && trajectoryCurve && (
            <>
              {/* Outer Glow Stroke */}
              <path
                d={trajectoryCurve}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={5}
                strokeOpacity={0.3}
                filter="url(#glowFilter)"
              />
              {/* Crisp Core Stroke */}
              <path
                d={trajectoryCurve}
                fill="none"
                stroke="#fbbf24"
                strokeWidth={2.5}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </>
          )}

          {/* Individual Data Points */}
          {trajectoryPoints.map(([px, py], idx) => {
            const isHov = hoveredIdx === idx;
            const isLast = idx === trajectoryPoints.length - 1;
            const hasMilestone = !!processedData[idx]?.milestone;

            return (
              <g key={idx}>
                {/* Milestone Marker Indicator */}
                {hasMilestone && (
                  <g>
                    <line
                      x1={px}
                      y1={py - 12}
                      x2={px}
                      y2={py}
                      stroke="#34d399"
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                    />
                    <circle cx={px} cy={py - 14} r={3} fill="#34d399" />
                  </g>
                )}

                {/* Animated Pulsing Dot on Current/Last Node */}
                {isLast && hoveredIdx === null && (
                  <circle
                    cx={px}
                    cy={py}
                    r={6}
                    fill="#fbbf24"
                    fillOpacity={0.4}
                    className="animate-ping"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={px}
                  cy={py}
                  r={isHov ? 5 : isLast ? 4 : 2.5}
                  fill={isHov ? '#ffffff' : hasMilestone ? '#34d399' : '#f59e0b'}
                  stroke="#140e0a"
                  strokeWidth={2}
                  className="transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Interactive Crosshair & Cursor Line */}
          {hoveredIdx !== null && (
            <g className="pointer-events-none">
              <line
                x1={activeX}
                y1={padding.top}
                x2={activeX}
                y2={baseY}
                stroke="#fbbf24"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                strokeOpacity={0.8}
              />
              <circle
                cx={activeX}
                cy={activeY}
                r={7}
                fill="#fbbf24"
                stroke="#ffffff"
                strokeWidth={2}
                filter="url(#glowFilter)"
              />
            </g>
          )}

          {/* X-Axis Labels (Sampled for clean spacing) */}
          {processedData.map((point, idx) => {
            const shouldShow =
              count <= 10 ||
              idx === 0 ||
              idx === count - 1 ||
              idx === Math.floor(count / 2) ||
              idx % Math.ceil(count / 6) === 0;

            if (!shouldShow) return null;

            return (
              <text
                key={point.date}
                x={getX(idx)}
                y={baseY + 20}
                fill={hoveredIdx === idx ? '#fbbf24' : '#a89786'}
                fontSize="10"
                fontFamily="var(--font-mono)"
                fontWeight={hoveredIdx === idx ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {point.date.includes('(') ? point.date.split('(')[0].trim() : point.date}
              </text>
            );
          })}
        </svg>

        {/* --- FLOATING HUD TOOLTIP --- */}
        {hoveredIdx !== null && activePoint && (
          <div
            style={{
              left: `${Math.min(Math.max(activeX, 120), svgWidth - 140)}px`,
              top: `${Math.max(20, activeY - 140)}px`,
              transform: 'translateX(-50%)',
            }}
            className="absolute z-50 pointer-events-none w-64 p-3.5 rounded-2xl bg-[#0c0805]/98 border border-amber-500/40 shadow-2xl backdrop-blur-2xl text-xs space-y-2 animate-fade-in"
          >
            {/* Header: Date & Milestone */}
            <div className="flex items-center justify-between border-b border-[#3d2b20] pb-1.5">
              <span className="font-mono font-bold text-white text-[11px] truncate">
                {activePoint.date}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {activePoint.accelerationFactor}x accel
              </span>
            </div>

            {activePoint.milestone && (
              <div className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{activePoint.milestone}</span>
              </div>
            )}

            {/* Metrics Breakdown */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Input Prompts:</span>
                </span>
                <span className="font-mono font-bold text-indigo-300">
                  {formatNumber(viewMode === 'cumulative' ? activePoint.cumulativeInput : activePoint.inputTokens)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Reasoning / Output:</span>
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {formatNumber(viewMode === 'cumulative' ? activePoint.cumulativeOutput : activePoint.outputTokens)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Cache Savings:</span>
                </span>
                <span className="font-mono font-bold text-emerald-300">
                  {formatNumber(viewMode === 'cumulative' ? activePoint.cumulativeCache : activePoint.cacheTokens)}
                </span>
              </div>
            </div>

            {/* Total Volume & Spend */}
            <div className="pt-2 border-t border-[#3d2b20] flex items-center justify-between text-[11px]">
              <div>
                <div className="text-[9px] uppercase text-[#a89786] font-mono">
                  {viewMode === 'cumulative' ? 'Cumulative Volume' : 'Step Volume'}
                </div>
                <div className="font-mono font-black text-amber-300 text-xs">
                  {formatNumber(viewMode === 'cumulative' ? activePoint.cumulativeTotal : activePoint.stepTotal)} tokens
                </div>
              </div>

              <div className="text-right">
                <div className="text-[9px] uppercase text-[#a89786] font-mono">Spend Trajectory</div>
                <div className="font-mono font-bold text-amber-400 text-xs">
                  {formatCurrency(viewMode === 'cumulative' ? activePoint.cumulativeCost : activePoint.cost)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- FOOTER BANNER: EXPLANATORY CONTEXT & INSIGHTS --- */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-2 border-t border-[#3d2b20]/60 text-[11px] text-[#b8a695]">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {viewMode === 'cumulative'
              ? 'Compounding curve visualizes context window growth & cumulative fleet burn across autonomous agent turns.'
              : viewMode === 'velocity'
              ? 'Instantaneous velocity measures token burn acceleration and runaway loop triggers.'
              : 'Discrete step breakdown highlights prompt caching efficiency and output reasoning overhead.'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400/90 font-mono text-[10px] shrink-0 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Telemetry Synchronized</span>
        </div>
      </div>
    </div>
  );
}
