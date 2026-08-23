'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, User, LogIn, LogOut, UserPlus, Sparkles, ChevronDown } from 'lucide-react';
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
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'sso'>('signin');
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

  const openAuth = (mode: 'signin' | 'signup' | 'sso') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Org:</span>
            <span className="font-semibold text-white truncate max-w-[180px] sm:max-w-none">
              {user?.organization ? user.organization : 'Acme Engineering (org_default)'}
            </span>
          </div>

          {user && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {user.provider ? `${user.provider.toUpperCase()} SSO` : 'VERIFIED'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Time range selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-inner">
            {(['24h', '7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  range === r
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-850 transition-all shadow-sm"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          )}

          {/* User Profile / Identity Button */}
          {user ? (
            <div className="relative pl-2 border-l border-slate-800">
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs cursor-pointer transition-all shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-white font-semibold text-[11px] leading-tight truncate max-w-[120px]">
                    {user.name}
                  </div>
                  <div className="text-slate-400 text-[9px] uppercase font-mono truncate max-w-[120px]">
                    {user.role || 'Member'}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl p-3 space-y-3 z-50 animate-fade-in">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                    <div className="font-bold text-xs text-white truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                    <div className="mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block truncate max-w-full">
                      {user.organization || 'Acme Engineering'}
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 pt-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        openAuth('signup');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-900 transition-colors text-left"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Switch / Create Organization</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors text-left"
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-semibold shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => openAuth('signup')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
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
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(profile) => setUser(profile)}
      />
    </>
  );
}
