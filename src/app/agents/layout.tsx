import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent Fleet Observability & Telemetry Analytics',
  description: 'Monitor Claude Code, GitHub Copilot, Gemini Antigravity, and AI coding agents in real-time. Compare token volume, latency, error rates, and cost burn.',
  alternates: {
    canonical: '/agents',
  },
  openGraph: {
    title: 'AI Agent Fleet Observability | TokenTrail',
    description: 'Compare latency, error rates, prompt token volume, and estimated spend across all deployed coding assistants.',
    url: 'https://tokentrail.xyz/agents',
  },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
