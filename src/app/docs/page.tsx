'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import {
  Terminal,
  BookOpen,
  Copy,
  Check,
  Zap,
  Bot,
  ShieldCheck,
  Code2,
  Cpu,
  Key,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Layers,
  Flame,
} from 'lucide-react';

export default function DocsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cli' | 'claude' | 'gemini' | 'copilot' | 'sdk'>('cli');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#140e0a]">
      <Navbar range="30d" onRangeChange={() => {}} />

      <div className="p-6 md:p-10 max-w-6xl mx-auto w-full space-y-10 animate-fade-in">
        {/* Header Breadcrumb & Title */}
        <div className="space-y-3 pb-6 border-b border-[#3d2b20]/60">
          <div className="flex items-center gap-2 text-xs text-[#a89786] font-mono">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              TokenTrail
            </Link>
            <ChevronRight className="w-3 h-3 text-[#6e5d50]" />
            <span className="text-amber-400 font-medium">Documentation & Installation Guide</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-amber-400" />
                Installation & Integration Guide
              </h1>
              <p className="text-sm text-[#d1c2b4] mt-1.5 max-w-3xl">
                Quickly connect your AI coding agents — Claude Code, GitHub Copilot, Gemini / Antigravity, OpenAI Codex, and xAI Grok to stream sub-millisecond telemetry to TokenTrail.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold font-mono transition-all w-fit shrink-0"
            >
              <span>← Back to Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Quick 3-Step Setup Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/25 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-bold text-white text-base">Install CLI</h3>
            <p className="text-xs text-[#b8a695] leading-relaxed font-medium">
              Run TokenTrail zero-config CLI via npx or global npm package manager.
            </p>
            <div className="p-2.5 rounded-xl bg-[#120c09] border border-[#3d2b20] font-mono text-[11px] text-amber-300 flex items-center justify-between">
              <code>npm i -g tokentrail</code>
              <button
                onClick={() => copyToClipboard('npm i -g tokentrail', 'step1')}
                className="text-[#a89786] hover:text-amber-300 p-1"
                title="Copy command"
              >
                {copiedKey === 'step1' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-orange-500/25 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 font-mono font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-bold text-white text-base">Authenticate</h3>
            <p className="text-xs text-[#b8a695] leading-relaxed font-medium">
              Link terminal and auto-populate your organization telemetry API tokens.
            </p>
            <div className="p-2.5 rounded-xl bg-[#120c09] border border-[#3d2b20] font-mono text-[11px] text-amber-300 flex items-center justify-between">
              <code>tokentrail login</code>
              <button
                onClick={() => copyToClipboard('tokentrail login', 'step2')}
                className="text-[#a89786] hover:text-amber-300 p-1"
                title="Copy command"
              >
                {copiedKey === 'step2' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-yellow-500/25 space-y-3 relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 font-mono font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-bold text-white text-base">Auto-Hook Agents</h3>
            <p className="text-xs text-[#b8a695] leading-relaxed font-medium">
              Automatically detect and attach telemetry hooks to all installed coding agents.
            </p>
            <div className="p-2.5 rounded-xl bg-[#120c09] border border-[#3d2b20] font-mono text-[11px] text-amber-300 flex items-center justify-between">
              <code>tokentrail hook --all</code>
              <button
                onClick={() => copyToClipboard('tokentrail hook --all', 'step3')}
                className="text-[#a89786] hover:text-amber-300 p-1"
                title="Copy command"
              >
                {copiedKey === 'step3' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Integration Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Integration Guides by Platform
            </h2>

            {/* Tab navigation */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1c140f] border border-[#3d2b20] overflow-x-auto">
              {[
                { id: 'cli', label: 'CLI & Terminal' },
                { id: 'claude', label: 'Claude Code' },
                { id: 'gemini', label: 'Gemini / Antigravity' },
                { id: 'copilot', label: 'GitHub Copilot' },
                { id: 'sdk', label: 'Node / Python SDK' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-900/40'
                      : 'text-[#a89786] hover:text-amber-200 hover:bg-[#251a13]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: CLI & Terminal */}
          {activeTab === 'cli' && (
            <div className="p-6 md:p-8 rounded-2xl glass-panel space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  TokenTrail CLI Setup
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  The TokenTrail CLI provides zero-config fleet discovery, telemetry proxies, and live terminal session stream tracing.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 font-mono">
                    Option A: Run without installation (NPX)
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 font-mono text-xs text-emerald-300 flex items-center justify-between">
                    <code>npx tokentrail@latest login</code>
                    <button
                      onClick={() => copyToClipboard('npx tokentrail@latest login', 'cli-npx')}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                    >
                      {copiedKey === 'cli-npx' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2 font-mono">
                    Option B: Install Globally via NPM / PNPM / Yarn
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 font-mono text-xs text-emerald-300 flex items-center justify-between">
                    <code>npm install -g tokentrail</code>
                    <button
                      onClick={() => copyToClipboard('npm install -g tokentrail', 'cli-npm')}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                    >
                      {copiedKey === 'cli-npm' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Claude Code */}
          {activeTab === 'claude' && (
            <div className="p-6 md:p-8 rounded-2xl glass-panel space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-amber-400" />
                  Claude Code Integration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect Anthropic's Claude Code terminal CLI to stream token counts, cached prompts, and execution latencies.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2">1. Auto-hook Claude Code CLI:</h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 font-mono text-xs text-emerald-300 flex items-center justify-between">
                    <code>tokentrail hook --agent claude-code</code>
                    <button
                      onClick={() => copyToClipboard('tokentrail hook --agent claude-code', 'claude-hook')}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                    >
                      {copiedKey === 'claude-hook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2">2. Or configure via Environment Variable:</h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 font-mono text-xs text-slate-300 space-y-1">
                    <div className="text-emerald-400">export CLAUDE_CODE_TELEMETRY_ENDPOINT="https://ingest.tokentrail.xyz/api/v1/telemetry/ingest"</div>
                    <div className="text-emerald-400">export TOKENTRAIL_API_KEY="tt_live_your_key_here"</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Gemini / Antigravity */}
          {activeTab === 'gemini' && (
            <div className="p-6 md:p-8 rounded-2xl glass-panel space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Gemini & Antigravity IDE Integration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Trace autonomous agentic planning, multi-turn reasoning steps, and token efficiency in Antigravity IDE.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-300 mb-2">Auto-configure Antigravity IDE config:</h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 font-mono text-xs text-emerald-300 flex items-center justify-between">
                    <code>tokentrail hook --agent gemini-antigravity</code>
                    <button
                      onClick={() => copyToClipboard('tokentrail hook --agent gemini-antigravity', 'gemini-hook')}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                    >
                      {copiedKey === 'gemini-hook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/15 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-white">Manual Config in <code className="text-emerald-400">~/.gemini/config/telemetry.json</code>:</div>
                  <pre className="font-mono text-[11px] text-emerald-300 bg-black/60 p-3 rounded-lg overflow-x-auto">
{`{
  "telemetry": {
    "enabled": true,
    "endpoint": "https://ingest.tokentrail.xyz/api/v1/telemetry/ingest",
    "apiKey": "tt_live_your_key_here"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GitHub Copilot */}
          {activeTab === 'copilot' && (
            <div className="p-6 md:p-8 rounded-2xl glass-panel space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" />
                  GitHub Copilot Telemetry Bridge
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Capture inline completion generation, chat prompts, and developer workspace stats from VS Code / JetBrains.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 font-mono text-xs text-emerald-300 flex items-center justify-between">
                  <code>tokentrail hook --agent github-copilot</code>
                  <button
                    onClick={() => copyToClipboard('tokentrail hook --agent github-copilot', 'copilot-hook')}
                    className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                  >
                    {copiedKey === 'copilot-hook' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Node / Python SDK */}
          {activeTab === 'sdk' && (
            <div className="p-6 md:p-8 rounded-2xl glass-panel space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-teal-400" />
                  Custom SDK & API Integration
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Send telemetry programmatically from custom AI agents, LangChain, LlamaIndex, or agentic frameworks.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/15 text-xs space-y-2">
                  <div className="font-semibold text-white">JavaScript / TypeScript:</div>
                  <pre className="font-mono text-[11px] text-emerald-300 bg-black/60 p-3 rounded-lg overflow-x-auto">
{`import { TokenTrail } from '@tokentrail/sdk';

const tt = new TokenTrail({ apiKey: process.env.TOKENTRAIL_API_KEY });

await tt.recordSession({
  sessionId: 'sess_prod_01',
  agentName: 'custom-agent',
  model: 'gpt-4o',
  inputTokens: 1250,
  outputTokens: 420,
  cacheReadTokens: 500,
  durationMs: 840,
});`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CLI Command Reference Table */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            CLI Commands Reference
          </h2>

          <div className="glass-panel rounded-2xl overflow-hidden border border-emerald-500/15">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-emerald-500/15 text-slate-400 font-semibold uppercase tracking-wider font-mono">
                <tr>
                  <th className="px-6 py-4">Command</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10 font-mono">
                <tr className="hover:bg-emerald-950/20 transition-colors">
                  <td className="px-6 py-4 text-emerald-400 font-bold">tokentrail login</td>
                  <td className="px-6 py-4 text-slate-300 font-sans">Authenticate CLI with your browser and link organization tokens.</td>
                  <td className="px-6 py-4 text-right text-slate-400"><code>tokentrail login</code></td>
                </tr>
                <tr className="hover:bg-emerald-950/20 transition-colors">
                  <td className="px-6 py-4 text-emerald-400 font-bold">tokentrail status</td>
                  <td className="px-6 py-4 text-slate-300 font-sans">Inspect linked agents, latency, and ingestion status.</td>
                  <td className="px-6 py-4 text-right text-slate-400"><code>tokentrail status</code></td>
                </tr>
                <tr className="hover:bg-emerald-950/20 transition-colors">
                  <td className="px-6 py-4 text-emerald-400 font-bold">tokentrail hook --all</td>
                  <td className="px-6 py-4 text-slate-300 font-sans">Automatically detect and hook all installed coding agents.</td>
                  <td className="px-6 py-4 text-right text-slate-400"><code>tokentrail hook --all</code></td>
                </tr>
                <tr className="hover:bg-emerald-950/20 transition-colors">
                  <td className="px-6 py-4 text-emerald-400 font-bold">tokentrail trace &lt;id&gt;</td>
                  <td className="px-6 py-4 text-slate-300 font-sans">Stream live token and step execution traces in terminal.</td>
                  <td className="px-6 py-4 text-right text-slate-400"><code>tokentrail trace sess_123</code></td>
                </tr>
                <tr className="hover:bg-emerald-950/20 transition-colors">
                  <td className="px-6 py-4 text-emerald-400 font-bold">tokentrail logout</td>
                  <td className="px-6 py-4 text-slate-300 font-sans">Remove cached credentials from local terminal machine.</td>
                  <td className="px-6 py-4 text-right text-slate-400"><code>tokentrail logout</code></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
