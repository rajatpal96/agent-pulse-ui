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
    window.dispatchEvent(new Event('auth_change'));
    window.dispatchEvent(new Event('storage'));
  };

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="h-16 border-b border-[#3d2b20]/60 bg-[#100b08]/85 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-30 shadow-md shadow-black/50">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1c140f] border border-amber-500/25 text-xs font-semibold text-[#f5eae0] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-[#a89786] font-normal">Org:</span>
            <span className="font-semibold text-amber-100 truncate max-w-[180px] sm:max-w-none">
              {user?.organization ? user.organization : 'TokenTrail Workspace'}
            </span>
          </div>

          {user && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              VERIFIED
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#17100c] border border-[#3d2b20]/80 text-xs shadow-inner">
            {(['24h', '7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-all duration-150 ${
                  range === r
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-900/40 font-bold'
                    : 'text-[#a89786] hover:text-amber-200 hover:bg-[#251a13]/60 font-medium'
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c140f] border border-amber-500/20 text-xs font-semibold text-[#e6d7c8] hover:text-white hover:bg-[#251a13] hover:border-amber-500/40 transition-all shadow-sm active:scale-95"
              title="Sync Fleet Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          )}

          {/* User Profile / Identity Button */}
          {user ? (
            <div className="relative pl-2 border-l border-[#3d2b20]/60">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#1c140f] hover:bg-[#251a13] border border-amber-500/20 text-xs cursor-pointer transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-[#faf5ee] font-semibold text-[11px] leading-tight truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-amber-400/80 text-[9px] uppercase font-mono truncate max-w-[120px]">
                    {user.role || 'Engineer'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-[#a89786]" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#1c140f] border border-amber-500/30 shadow-2xl shadow-black p-3 space-y-3 z-50 animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-[#120c09] border border-[#3d2b20]">
                    <div className="font-bold text-xs text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-[#a89786] truncate">{user.email}</div>
                    <div className="mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-block truncate max-w-full font-semibold">
                      {user.organization || 'Workspace Member'}
                    </div>
                  </div>

                  <div className="border-t border-[#3d2b20] pt-2">
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1c140f] hover:bg-[#251a13] border border-amber-500/25 hover:border-amber-500/50 text-[#f5eae0] text-xs font-semibold shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuth('signup')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-xs shadow-lg shadow-amber-600/30 transition-all hover:scale-[1.02] active:scale-98"
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
        onSuccess={(profile) => {
          setUser(profile);
          window.dispatchEvent(new Event('auth_change'));
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </>
  );
}
