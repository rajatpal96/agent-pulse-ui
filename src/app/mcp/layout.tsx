import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Model Context Protocol (MCP) Server Observability & Tool Tracing',
  description: 'Inspect Model Context Protocol server invocations, tool latency, prompt payloads, and multi-agent coordination streams in real-time.',
  alternates: {
    canonical: '/mcp',
  },
  openGraph: {
    title: 'MCP Server Observability | TokenTrail',
    description: 'Real-time telemetry and tool latency analytics for Model Context Protocol servers.',
    url: 'https://tokentrail.xyz/mcp',
  },
};

export default function McpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
