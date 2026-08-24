'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, LogIn, LogOut, UserPlus, Sparkles, ChevronDown, Activity } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  range: string;
  onRangeChange: (range: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function Navbar({ range, onRangeChange, onRefresh, isRefreshing }: NavbarProps) {
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [cliCallbackUrl, setCliCallbackUrl] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('tokentrail_user') || localStorage.getItem('agentmeter_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      } else {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('storage', checkUser);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cliCallback = params.get('cli_callback');
      if (cliCallback) {
        setCliCallbackUrl(cliCallback);
        setIsAuthOpen(true);
      }
    }

    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('agentmeter_token');
    localStorage.removeItem('agentmeter_user');
    localStorage.removeItem('tokentrail_token');
    localStorage.removeItem('tokentrail_user');
    setUser(null);
    setShowProfileMenu(false);
  };

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="h-16 border-b border-emerald-500/15 bg-[#060b08]/85 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-30 shadow-md shadow-black/40">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c1410] border border-emerald-500/20 text-xs font-semibold text-slate-200 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 font-normal">Org:</span>
            <span className="font-semibold text-emerald-100 truncate max-w-[180px] sm:max-w-none">
              {user?.organization ? user.organization : 'AgentMeter Workspace'}
            </span>
          </div>

          {user && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              VERIFIED
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#0a140e] border border-emerald-500/20 text-xs shadow-inner">
            {(['24h', '7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-all duration-150 ${
                  range === r
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/30 font-bold'
                    : 'text-slate-400 hover:text-emerald-200 hover:bg-emerald-950/40 font-medium'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c1410] border border-emerald-500/20 text-xs font-semibold text-slate-300 hover:text-white hover:bg-emerald-950/40 hover:border-emerald-500/40 transition-all shadow-sm active:scale-95"
              title="Sync Fleet Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          )}

          {/* User Profile / Identity Button */}
          {user ? (
            <div className="relative pl-2 border-l border-emerald-500/20">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#0c1410] hover:bg-emerald-950/40 border border-emerald-500/20 text-xs cursor-pointer transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-emerald-50 font-semibold text-[11px] leading-tight truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-emerald-400/70 text-[9px] uppercase font-mono truncate max-w-[120px]">
                    {user.role || 'Engineer'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0c1410] border border-emerald-500/30 shadow-2xl shadow-black p-3 space-y-3 z-50 animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/20">
                    <div className="font-bold text-xs text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <div className="mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-block truncate max-w-full font-semibold">
                      {user.organization || 'Workspace Member'}
                    </div>
                  </div>

                  <div className="border-t border-emerald-500/15 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('signin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0c1410] hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/40 text-slate-200 text-xs font-semibold shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuth('signup')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-98"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        cliCallback={cliCallbackUrl}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(profile) => setUser(profile)}
      />
    </>
  );
}
