'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Terminal,
  Cpu,
  Radio,
  Sparkles,
  BookOpen,
} from 'lucide-react';

import { TokenTrailLogo } from './TokenTrailLogo';

const NAV_ITEMS = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'AI Agents', href: '/agents', icon: Bot },
  { name: 'Sessions', href: '/sessions', icon: Terminal },
  { name: 'Models & Tokens', href: '/models', icon: Cpu },
  { name: 'Docs & Setup', href: '/docs', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-emerald-500/15 bg-[#060b08]/95 backdrop-blur-2xl flex flex-col h-screen sticky top-0 z-40 shadow-2xl shadow-black">
      {/* Brand Header */}
      <div className="p-5 border-b border-emerald-500/15 flex items-center justify-between bg-gradient-to-b from-emerald-950/20 to-transparent">
        <Link href="/" className="flex items-center gap-3 group">
          <TokenTrailLogo size={36} />
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
              <span>Token</span>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Trail
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono font-semibold border border-emerald-500/30">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium font-mono">AI Fleet Metrics</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-5 space-y-2 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest font-mono">
          Observability
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-transparent text-emerald-100 border border-emerald-500/30 shadow-lg shadow-emerald-950/50 translate-x-0.5'
                  : 'text-slate-400 hover:text-emerald-200 hover:bg-emerald-950/30 hover:border-emerald-500/20 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 group-hover:text-emerald-400'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="tracking-tight">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
