'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import {
  Terminal,
  ArrowLeft,
  Clock,
  Cpu,
  Coins,
  Activity,
  CheckCircle2,
  AlertCircle,
  Code2,
  Bot,
  Zap,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { apiFetch } from '@/lib/api';

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/v1/sessions/${sessionId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch session detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSession();
  }, [sessionId]);

  const session = data?.session;
  const events = data?.events || [];

  return (
    <div className="flex-1 flex flex-col">
      <Navbar range="30d" onRangeChange={() => {}} onRefresh={fetchSession} />

      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Back Link */}
        <Link
          href="/sessions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sessions Explorer
        </Link>

        {/* Session Header Card */}
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/20 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Terminal className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-mono">{sessionId}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                    RECORDED
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Agent: <strong className="text-emerald-200 font-mono">{session?.agentName || 'AI Agent'}</strong> • Repo:{' '}
                  <strong className="text-emerald-200 font-mono">{session?.projectId || 'main-repo'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div>
                <div className="text-xs text-slate-400">Session Total Spend</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {formatCurrency(session?.totalCostUsd || 0)}
                </div>
              </div>
            </div>
          </div>

          {/* Session Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-500/15 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/15">
              <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" /> Duration
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {Math.round((session?.durationMs || 1000) / 1000)}s
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/15">
              <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Invocations
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {session?.requestCount || events.length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/15">
              <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Total Tokens
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {formatNumber(session?.totalTokens || 0)}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/15">
              <span className="text-slate-400 flex items-center gap-1.5 mb-1">
                <Zap className="w-3.5 h-3.5 text-lime-400" /> Events Logged
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {events.length}
              </span>
            </div>
          </div>
        </div>

        {/* Chronological Event Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            Chronological Telemetry Event Timeline
          </h3>

          {events.length === 0 && !loading ? (
            <div className="p-8 text-center glass-panel rounded-2xl border border-emerald-500/15 text-emerald-400/60 font-mono">
              No detailed event payloads recorded for this session.
            </div>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-emerald-500/20">
              {events.map((evt: any, idx: number) => (
                <div key={evt.eventId || idx} className="relative pl-10 group">
                  {/* Timeline Dot */}
                  <div className="absolute left-2.5 top-4 w-3.5 h-3.5 -translate-x-1/2 rounded-full bg-[#060b08] border-2 border-emerald-500 group-hover:border-teal-400 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.5)]" />

                  <div className="p-4 rounded-2xl glass-panel border border-emerald-500/15 hover:border-emerald-500/30 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">{evt.eventId}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-emerald-500/20 text-slate-300 font-mono text-[11px]">
                          {evt.model?.name || 'Default Model'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                        <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        <span className="text-emerald-400 font-bold">
                          {formatCurrency(evt.cost?.total || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Token breakdown row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/10 text-[11px] font-mono">
                      <div className="text-slate-400">
                        Input:{' '}
                        <strong className="text-emerald-300">
                          {formatNumber(evt.usage?.inputTokens || 0)}
                        </strong>
                      </div>
                      <div className="text-slate-400">
                        Output:{' '}
                        <strong className="text-teal-300">
                          {formatNumber(evt.usage?.outputTokens || 0)}
                        </strong>
                      </div>
                      <div className="text-slate-400">
                        Cache Read:{' '}
                        <strong className="text-cyan-300">
                          {formatNumber(evt.usage?.cacheReadTokens || 0)}
                        </strong>
                      </div>
                      <div className="text-slate-400">
                        Latency:{' '}
                        <strong className="text-amber-300">
                          {evt.performance?.latencyMs ? `${evt.performance.latencyMs}ms` : '—'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
