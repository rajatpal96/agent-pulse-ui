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
    bg: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/25 hover:border-emerald-500/50',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    accent: 'from-emerald-400 to-teal-300',
  },
  mint: {
    bg: 'from-teal-500/15 via-teal-500/5 to-transparent',
    border: 'border-teal-500/25 hover:border-teal-500/50',
    iconBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.15)]',
    accent: 'from-teal-300 to-cyan-300',
  },
  teal: {
    bg: 'from-cyan-500/15 via-teal-500/5 to-transparent',
    border: 'border-teal-500/25 hover:border-teal-500/50',
    iconBg: 'bg-teal-500/20 text-teal-400 border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.15)]',
    accent: 'from-cyan-300 to-emerald-300',
  },
  cyan: {
    bg: 'from-cyan-500/15 via-cyan-500/5 to-transparent',
    border: 'border-cyan-500/25 hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    accent: 'from-cyan-300 to-blue-300',
  },
  lime: {
    bg: 'from-lime-500/15 via-lime-500/5 to-transparent',
    border: 'border-lime-500/25 hover:border-lime-500/50',
    iconBg: 'bg-lime-500/20 text-lime-400 border-lime-500/30 shadow-[0_0_15px_rgba(132,204,22,0.15)]',
    accent: 'from-lime-300 to-emerald-300',
  },
  amber: {
    bg: 'from-amber-500/15 via-amber-500/5 to-transparent',
    border: 'border-amber-500/25 hover:border-amber-500/50',
    iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    accent: 'from-amber-300 to-yellow-300',
  },
  rose: {
    bg: 'from-rose-500/15 via-rose-500/5 to-transparent',
    border: 'border-rose-500/25 hover:border-rose-500/50',
    iconBg: 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    accent: 'from-rose-300 to-pink-300',
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
    <div className={`p-5 rounded-2xl glass-panel glass-panel-hover bg-gradient-to-br ${styles.bg} border ${styles.border} flex flex-col justify-between relative overflow-hidden group shadow-lg`}>
      {/* Background ambient corner glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight font-mono">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl border ${styles.iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs relative z-10">
        {subtitle && <span className="text-slate-400 font-medium text-[11px]">{subtitle}</span>}
        {trend && (
          <span
            className={`flex items-center gap-1 font-semibold font-mono text-[11px] px-2 py-0.5 rounded-full ${
              trend.isPositive
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
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
