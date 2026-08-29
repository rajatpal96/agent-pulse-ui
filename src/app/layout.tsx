import './globals.css';
import { Sidebar } from '../components/Sidebar';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tokentrail.xyz'),
  title: {
    default: 'TokenTrail | AI Agent Fleet Observability & Cost Intelligence Platform',
    template: '%s | TokenTrail',
  },
  description: 'Unified AI coding-agent usage, token metrics, cost intelligence, session timelines, and fleet observability across Claude Code, GitHub Copilot, Gemini/Antigravity, Codex, and Grok.',
  keywords: [
    'AI agent observability',
    'Token tracking',
    'Claude Code tokens',
    'GitHub Copilot telemetry',
    'Gemini Antigravity token usage',
    'AI cost intelligence',
    'LLM token analytics',
    'MCP server observability',
    'Coding agents telemetry',
    'Prompt cache savings',
    'AI spend burn rate',
  ],
  authors: [{ name: 'TokenTrail Team', url: 'https://tokentrail.xyz' }],
  creator: 'TokenTrail',
  publisher: 'TokenTrail',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'TokenTrail | AI Agent Usage & Observability Platform',
    description: 'Unified AI coding-agent usage, token metrics, cost intelligence, session timelines, and MCP observability.',
    url: 'https://tokentrail.xyz',
    siteName: 'TokenTrail',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TokenTrail | AI Agent Usage & Observability Platform',
    description: 'Unified AI coding-agent usage, token metrics, cost intelligence, session timelines, and MCP observability.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#140e0a] text-[#fbf5ee] antialiased min-h-screen flex selection:bg-amber-500 selection:text-black">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
