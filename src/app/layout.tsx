import './globals.css';
import { Sidebar } from '../components/Sidebar';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tokentrail.xyz'),
  title: 'TokenTrail (AgentMeter) | AI Agent Usage & Observability Platform',
  description: 'Unified AI coding-agent usage, token metrics, cost intelligence, session timelines, and MCP observability across Claude Code, GitHub Copilot, Gemini/Antigravity, Codex, and Grok.',
  openGraph: {
    title: 'TokenTrail | AI Agent Usage & Observability Platform',
    description: 'Unified AI coding-agent usage, token metrics, cost intelligence, session timelines, and MCP observability.',
    url: 'https://tokentrail.xyz',
    siteName: 'TokenTrail',
    locale: 'en_US',
    type: 'website',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#060b08] text-emerald-50 antialiased min-h-screen flex selection:bg-emerald-500 selection:text-slate-950">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
