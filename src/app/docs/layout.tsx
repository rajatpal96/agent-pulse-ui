import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation & CLI Setup Guide | Claude Code & Agent Telemetry',
  description: 'Quickstart CLI installation and integration guide for streaming sub-millisecond AI token telemetry from Claude Code, terminal coding assistants, and IDE extensions.',
  alternates: {
    canonical: '/docs',
  },
  openGraph: {
    title: 'TokenTrail Documentation & Integration Guide',
    description: 'Quickly connect your AI coding agents to stream sub-millisecond token and cost telemetry.',
    url: 'https://tokentrail.xyz/docs',
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
