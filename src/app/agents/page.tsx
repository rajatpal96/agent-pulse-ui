'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import {
  Bot,
  Terminal,
  Code2,
  Sparkles,
  Flame,
  Clock,
  AlertCircle,
  Cpu,
  Coins,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { apiFetch } from '@/lib/api';

const AGENT_BADGES: Record<string, { label: string; icon: any; gradient: string; tag: string }> = {
  'claude-code': {
    label: 'Claude Code',
    icon: Terminal,
    gradient: 'from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/30',
    tag: 'Autonomous Terminal CLI',
  },
  'github-copilot': {
    label: 'GitHub Copilot',
    icon: Code2,
    gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent border-cyan-500/30',
    tag: 'IDE Inline & Chat',
  },
  'gemini-antigravity': {
    label: 'Gemini / Antigravity',
    icon: Sparkles,
    gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/30',
    tag: 'Autonomous Agentic IDE',
  },
  codex: {
    label: 'Codex / OpenAI',
    icon: Bot,
    gradient: 'from-teal-500/20 via-teal-500/5 to-transparent border-teal-500/30',
    tag: 'Code Generation API',
  },
  grok: {
    label: 'xAI Grok',
    icon: Flame,
    gradient: 'from-lime-500/20 via-lime-500/5 to-transparent border-lime-500/30',
    tag: 'Coding Intelligence',
  },
};

export default function AgentsPage() {
  const [range, setRange] = useState('30d');
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(`/api/v1/analytics/usage/by-agent?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setAgents(json.agents || []);
      }
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [range]);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar range={range} onRangeChange={(r) => setRange(r)} onRefresh={fetchAgents} />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            AI Agent Fleet Observability
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Compare latency, error rates, prompt token volume, and estimated spend across all deployed coding assistants.
          </p>
        </div>

        {/* Agent Cards Grid */}
        {agents.length === 0 && !loading ? (
          <div className="p-12 text-center glass-panel rounded-2xl border border-emerald-500/15 text-emerald-400/60 font-mono">
            No agent fleet telemetry logged for this period. Use the Live Telemetry Simulator or connect your agents to begin.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const meta = AGENT_BADGES[agent._id] || {
                label: agent._id,
                icon: Bot,
                gradient: 'from-emerald-950/40 via-emerald-950/10 to-transparent border-emerald-500/20',
                tag: agent.agentType || 'Coding Agent',
              };
              const Icon = meta.icon;
              const errorRate = agent.totalRequests > 0 ? ((agent.errorCount / agent.totalRequests) * 100).toFixed(1) : '0.0';

              return (
                <div
                  key={agent._id}
                  className={`p-6 rounded-2xl glass-panel bg-gradient-to-br ${meta.gradient} border flex flex-col justify-between space-y-6 transition-all hover:scale-[1.01]`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-white shadow-md">
                          <Icon className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{meta.label}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 text-emerald-300 border border-emerald-500/20">
                            {meta.tag}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400 font-mono text-base">
                          {formatCurrency(agent.totalCostUsd || 0)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">est. spend</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-emerald-500/15 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/15">
                        <span className="text-slate-400 flex items-center gap-1 mb-1">
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Total Tokens
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {formatNumber(agent.totalTokens || 0)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/15">
                        <span className="text-slate-400 flex items-center gap-1 mb-1">
                          <Clock className="w-3.5 h-3.5 text-teal-400" /> Avg Latency
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {agent.avgLatencyMs ? `${Math.round(agent.avgLatencyMs)}ms` : '—'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/15">
                        <span className="text-slate-400 flex items-center gap-1 mb-1">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Invocations
                        </span>
                        <span className="font-mono font-bold text-white text-sm">
                          {formatNumber(agent.totalRequests || 0)}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/15">
                        <span className="text-slate-400 flex items-center gap-1 mb-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Error Rate
                        </span>
                        <span className="font-mono font-bold text-rose-400 text-sm">
                          {errorRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/15 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Models: <strong className="text-slate-200 font-mono">{agent.models?.slice(0, 2).join(', ') || 'Default'}</strong></span>
                    <span className="font-mono text-emerald-400">{agent.projects?.length || 1} repos</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
