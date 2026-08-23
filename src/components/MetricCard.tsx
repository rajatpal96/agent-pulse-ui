'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color?: 'emerald' | 'mint' | 'teal' | 'cyan' | 'lime' | 'amber' | 'rose';
}

const COLOR_MAP = {
  emerald: {
    bg: 'from-emerald-500/15 to-emerald-500/5',
    border: 'border-emerald-500/25',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  mint: {
    bg: 'from-teal-500/15 to-teal-500/5',
    border: 'border-teal-500/25',
    iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  },
  teal: {
    bg: 'from-cyan-500/15 to-teal-500/5',
    border: 'border-teal-500/25',
    iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  cyan: {
    bg: 'from-cyan-500/15 to-cyan-500/5',
    border: 'border-cyan-500/25',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  },
  lime: {
    bg: 'from-lime-500/15 to-lime-500/5',
    border: 'border-lime-500/25',
    iconBg: 'bg-lime-500/20 text-lime-400 border-lime-500/30',
  },
  amber: {
    bg: 'from-amber-500/15 to-amber-500/5',
    border: 'border-amber-500/25',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  rose: {
    bg: 'from-rose-500/15 to-rose-500/5',
    border: 'border-rose-500/25',
    iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
};

export function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = 'emerald',
}: MetricCardProps) {
  const styles = COLOR_MAP[color] || COLOR_MAP.emerald;

  return (
    <div className={`p-5 rounded-2xl glass-panel glass-panel-hover bg-gradient-to-br ${styles.bg} border ${styles.border} flex flex-col justify-between relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1 tracking-tight font-mono">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-xl border ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-400">{subtitle}</span>}
        {trend && (
          <span
            className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
