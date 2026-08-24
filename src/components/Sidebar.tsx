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
    <aside className="w-64 border-r border-[#3d2b20]/60 bg-[#100b08]/95 backdrop-blur-2xl flex flex-col h-screen sticky top-0 z-40 shadow-2xl shadow-black">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#3d2b20]/60 flex items-center justify-between bg-gradient-to-b from-[#2d1e16]/30 to-transparent">
        <Link href="/" className="flex items-center gap-3 group">
          <TokenTrailLogo size={36} />
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
              <span>Token</span>
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                Trail
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-mono font-semibold border border-amber-500/30">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-[#b8a695] font-medium font-mono">AI Fleet Metrics</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3.5 py-5 space-y-2 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-amber-400/80 uppercase tracking-widest font-mono">
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
                  ? 'bg-gradient-to-r from-amber-600/25 via-amber-700/15 to-transparent text-amber-100 border border-amber-500/35 shadow-lg shadow-amber-950/40 translate-x-0.5'
                  : 'text-[#a89786] hover:text-amber-100 hover:bg-[#251a13]/50 hover:border-amber-500/20 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                isActive ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-[#a89786] group-hover:text-amber-300'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="tracking-tight">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
