'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { MetricCard } from '../components/MetricCard';
import { TokenTrendChart } from '../components/TokenTrendChart';
import { AgentUsageBar } from '../components/AgentUsageBar';
import { AuthModal } from '../components/AuthModal';
import { TokenTrailLogo } from '../components/TokenTrailLogo';
import {
  Activity,
  Coins,
  Cpu,
  Bot,
  Terminal,
  FolderGit2,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  LogIn,
  UserPlus,
  Flame,
  Code2,
  BarChart3,
  Layers,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';

export default function OverviewPage() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const checkUser = () => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('tokentrail_user') || localStorage.getItem('agentmeter_user');
    const token = localStorage.getItem('tokentrail_token') || localStorage.getItem('agentmeter_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const fetchOverview = async () => {
    try {
      setIsRefreshing(true);
      const res = await apiFetch(`/api/v1/analytics/overview?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch overview data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('auth_change', checkUser);
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('auth_change', checkUser);
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchOverview();
    } else {
      setIsLoading(false);
    }
  }, [range, user]);

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#140e0a]">
      <Navbar
        range={range}
        onRangeChange={(r) => setRange(r)}
        onRefresh={user ? fetchOverview : undefined}
        isRefreshing={isRefreshing}
      />

      {/* --- LOGGED OUT STATE: ATTRACTIVE LANDING HERO & CTA --- */}
      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-12 animate-fade-in my-auto">
          {/* Main Hero Header */}
          <div className="text-center space-y-5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Universal AI Agent Fleet Observability & Cost Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Observe, Optimize & Govern Your{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                AI Coding Fleet
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#d1c2b4] leading-relaxed max-w-2xl mx-auto font-normal">
              Unified intelligence across <strong className="text-white">Claude Code</strong>, <strong className="text-white">GitHub Copilot</strong>, <strong className="text-white">Gemini / Antigravity</strong>, <strong className="text-white">Codex</strong>, and <strong className="text-white">Grok</strong>. Track real-time token trajectories, reasoning latencies, prompt caching savings, and session timelines.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <button
                onClick={() => openAuth('signup')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-bold text-sm shadow-xl shadow-amber-600/30 transition-all hover:scale-[1.02] active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => openAuth('signin')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1c140f] hover:bg-[#251a13] border border-amber-500/30 hover:border-amber-500/50 text-white font-semibold text-sm shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Sign In to Workspace</span>
              </button>
            </div>
          </div>

          {/* 4 Feature Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
            <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-amber-500/25 space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 w-fit">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Multi-Agent Fleet</h3>
              <p className="text-xs text-[#b8a695] leading-relaxed font-medium">
                Live automated telemetry capture from autonomous terminal CLIs, IDE chat agents, and coding bots.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-indigo-500/25 space-y-3">
              <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 w-fit">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Token Trajectory</h3>
              <p className="text-xs text-[#b8a695] leading-relaxed font-medium">
                High-contrast multi-color tracking of prompt inputs, reasoning outputs, and prompt cache hits.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-orange-500/25 space-y-3">
              <div className="p-3 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 w-fit">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Session Explorer</h3>
              <p className="text-xs text-[#b8a695] leading-relaxed font-medium">
                Deep-dive into step durations, tool invocations, token costs, and full developer coding workflows.
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-panel glass-panel-hover border border-yellow-500/25 space-y-3">
              <div className="p-3 rounded-xl bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 w-fit">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Cost Governance</h3>
              <p className="text-xs text-[#b8a695] leading-relaxed font-medium">
                Real-time spend allocation by repository, model provider, and developer team with budget ceilings.
              </p>
            </div>
          </div>

          {/* Quick CLI Connect Box */}
          <div className="w-full max-w-3xl p-6 rounded-3xl bg-[#1c140f] border border-amber-500/30 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#3d2b20] pb-3">
              <div className="flex items-center gap-2.5 font-mono text-amber-300 font-bold text-sm">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Quick Connect & Installation Guide</span>
              </div>
              <Link
                href="/docs"
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold font-mono flex items-center gap-1 group"
              >
                <span>Read Full Docs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#120c09] border border-[#3d2b20] space-y-2">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">1. Install CLI</div>
                <div className="font-mono text-[11px] text-slate-200 bg-black/60 p-2 rounded-lg border border-amber-500/10">
                  <code>npm i -g tokentrail</code>
                </div>
                <p className="text-[10px] text-[#a89786]">or run via npx without install</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#120c09] border border-[#3d2b20] space-y-2">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">2. Authenticate</div>
                <div className="font-mono text-[11px] text-slate-200 bg-black/60 p-2 rounded-lg border border-amber-500/10">
                  <code>tokentrail login</code>
                </div>
                <p className="text-[10px] text-[#a89786]">links terminal to workspace</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#120c09] border border-[#3d2b20] space-y-2">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">3. Hook Agents</div>
                <div className="font-mono text-[11px] text-slate-200 bg-black/60 p-2 rounded-lg border border-amber-500/10">
                  <code>tokentrail hook --all</code>
                </div>
                <p className="text-[10px] text-[#a89786]">auto-attaches telemetry stream</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-[#b8a695] border-t border-[#3d2b20]">
              <span className="font-mono text-amber-400/80">Sub-millisecond latency • No code changes required</span>
              <Link href="/docs" className="text-amber-400 hover:underline font-medium">
                Claude Code, Gemini, Copilot & SDK Setup →
              </Link>
            </div>
          </div>

          {/* Supported Agents Banner */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-[#a89786] mr-1 font-medium">Supported Fleet:</span>
            {[
              { name: 'Claude Code', color: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
              { name: 'GitHub Copilot', color: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20' },
              { name: 'Gemini / Antigravity', color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
              { name: 'OpenAI Codex', color: 'text-teal-300 bg-teal-500/10 border-teal-500/20' },
              { name: 'xAI Grok', color: 'text-lime-300 bg-lime-500/10 border-lime-500/20' },
            ].map((agent) => (
              <span key={agent.name} className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] ${agent.color}`}>
                {agent.name}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* --- LOGGED IN STATE: LIVE FLEET OBSERVABILITY DASHBOARD --- */
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-fade-in">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#3d2b20]/60">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Fleet Observability & Intelligence
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Live Fleet Active
                </span>
              </div>
              <p className="text-sm text-[#b8a695] mt-1.5 font-medium">
                Real-time telemetry, token burn rate, and latency metrics across Claude Code, GitHub Copilot, Gemini, Codex & Grok.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1c140f] border border-amber-500/20 text-xs font-mono text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {data ? (data.activeAgentsCount ?? (data.usageByAgent?.length || 0)) : 0} Agents Tracked
                </span>
              </div>
            </div>
          </div>

          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Total Spend"
              value={data ? formatCurrency(data.totalCostUsd || 0) : '$0.00'}
              subtitle={`Past ${range.toUpperCase()} consumption`}
              trend={{ value: '+8.4%', isPositive: true }}
              icon={Coins}
              color="amber"
            />
            <MetricCard
              title="Tokens Processed"
              value={data ? formatNumber(data.totalTokens || 0) : '0'}
              subtitle="Prompts, outputs & cache"
              trend={{ value: '+14.2%', isPositive: true }}
              icon={Cpu}
              color="mint"
            />
            <MetricCard
              title="AI Invocations"
              value={data ? formatNumber(data.totalRequests || 0) : '0'}
              subtitle="Agent completions & edits"
              trend={{ value: '+5.1%', isPositive: true }}
              icon={Activity}
              color="teal"
            />
            <MetricCard
              title="Active Agents"
              value={data ? (data.activeAgentsCount ?? (data.usageByAgent?.length || 0)) : 0}
              subtitle="Heterogeneous AI tools"
              icon={Bot}
              color="lime"
            />
          </div>

          {/* Main Grid: Token Trend & Agent Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Token & Cost Trend Chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl glass-panel glass-panel-hover space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    Token Volume & Spend Trajectory
                  </h3>
                  <p className="text-xs text-[#b8a695] mt-0.5 font-medium">
                    Prompt inputs vs generated completions vs cached prompt savings
                  </p>
                </div>
              </div>
              <TokenTrendChart data={data?.tokenTrend || []} />
            </div>

            {/* Usage by Agent Breakdown */}
            <div className="p-6 rounded-2xl glass-panel glass-panel-hover space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-amber-400" />
                    Fleet Share by Agent
                  </h3>
                  <p className="text-xs text-[#b8a695] mt-0.5 font-medium">
                    Distribution of token consumption
                  </p>
                </div>
                <Link
                  href="/agents"
                  className="text-xs text-amber-300 hover:text-amber-200 font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                >
                  Deep Dive →
                </Link>
              </div>
              <AgentUsageBar agents={data?.usageByAgent || []} />
            </div>
          </div>

          {/* Bottom Grid: Cost by Project & Recent Agent Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Allocation by Repository / Project */}
            <div className="p-6 rounded-2xl glass-panel glass-panel-hover space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-amber-400" />
                  Cost by Project & Repository
                </h3>
                <span className="text-[11px] font-mono font-medium text-[#b8a695] px-2 py-0.5 rounded-md bg-[#120c09] border border-[#3d2b20]">
                  Target: $250/repo
                </span>
              </div>

              <div className="space-y-3">
                {(!data?.costByProject || data.costByProject.length === 0) ? (
                  <div className="text-xs text-amber-400/60 py-8 text-center font-mono bg-[#120c09]/60 rounded-xl border border-[#3d2b20]/60">
                    No project telemetry recorded yet.
                  </div>
                ) : (
                  data.costByProject.map((proj: any) => {
                    const percent = Math.min(100, Math.round(((proj.totalCostUsd || 0) / (proj.budgetUsd || 250)) * 100));
                    return (
                      <div key={proj.projectId} className="p-3.5 rounded-xl bg-[#1c140f]/90 border border-[#3d2b20] hover:border-amber-500/40 transition-colors">
                        <div className="flex justify-between text-xs mb-2 font-medium">
                          <span className="text-[#f5eae0] font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                            {proj.projectId}
                          </span>
                          <span className="text-amber-400 font-mono font-semibold">
                            {formatCurrency(proj.totalCostUsd || 0)}{' '}
                            <span className="text-[#8c7b6d] font-normal">/ ${proj.budgetUsd || 250}</span>
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#120c09] overflow-hidden border border-[#3d2b20] p-[1px]">
                          <div
                            style={{ width: `${percent}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${
                              percent > 85
                                ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                                : percent > 60
                                ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                                : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Agent Sessions */}
            <div className="p-6 rounded-2xl glass-panel glass-panel-hover space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Live Agent Sessions
                </h3>
                <Link
                  href="/sessions"
                  className="text-xs text-amber-300 hover:text-amber-200 font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-2.5">
                {(!data?.recentSessions || data.recentSessions.length === 0) ? (
                  <div className="text-xs text-amber-400/60 py-8 text-center font-mono bg-[#120c09]/60 rounded-xl border border-[#3d2b20]/60">
                    No active agent sessions recorded.
                  </div>
                ) : (
                  data.recentSessions.map((session: any) => (
                    <Link
                      key={session.sessionId}
                      href={`/sessions/${session.sessionId}`}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#1c140f]/90 border border-[#3d2b20] hover:border-amber-500/50 hover:bg-[#251a13]/50 transition-all text-xs group shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#120c09] text-amber-300 border border-[#3d2b20] group-hover:border-amber-500/50 transition-colors">
                          <Terminal className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#f5eae0] group-hover:text-amber-300 font-mono transition-colors">
                            {session.sessionId}
                          </div>
                          <div className="text-[11px] text-[#b8a695] mt-0.5">
                            {session.agentName} • {Math.round((session.durationMs || 1000) / 1000)}s duration
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-amber-400 font-mono text-sm">
                          {formatCurrency(session.totalCostUsd || 0)}
                        </div>
                        <div className="text-[10px] text-[#8c7b6d] font-mono">
                          {formatNumber(session.totalTokens || 0)} tokens
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal for Landing CTAs */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(profile) => {
          setUser(profile);
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
