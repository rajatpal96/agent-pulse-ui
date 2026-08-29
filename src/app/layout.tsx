import './globals.css';
import { Sidebar } from '../components/Sidebar';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#140e0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
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
    'Claude Code usage metrics',
    'GitHub Copilot telemetry',
    'Gemini Antigravity token usage',
    'AI cost intelligence',
    'LLM token analytics',
    'MCP server observability',
    'Coding agents telemetry',
    'Prompt cache savings',
    'AI spend burn rate',
    'Developer AI observability',
  ],
  authors: [{ name: 'TokenTrail Team', url: 'https://tokentrail.xyz' }],
  creator: 'TokenTrail',
  publisher: 'TokenTrail',
  applicationName: 'TokenTrail',
  category: 'Developer Tools',
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
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://tokentrail.xyz/#organization',
      name: 'TokenTrail',
      url: 'https://tokentrail.xyz',
      description: 'Unified AI coding-agent usage, token metrics, cost intelligence, and fleet observability platform.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://tokentrail.xyz/#website',
      url: 'https://tokentrail.xyz',
      name: 'TokenTrail',
      publisher: {
        '@id': 'https://tokentrail.xyz/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://tokentrail.xyz/sessions?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://tokentrail.xyz/#webapp',
      name: 'TokenTrail',
      url: 'https://tokentrail.xyz',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'macOS, Linux, Windows',
      description: 'Real-time observability, token burn tracking, prompt cache savings, and cost governance for AI coding agents including Claude Code, GitHub Copilot, Gemini, Codex, and Grok.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: [
        'Claude Code Live Token Telemetry',
        'Exponential Token Usage Trajectory Graph',
        'Multi-Agent Fleet Observability',
        'Model Context Protocol (MCP) Server Tracing',
        'Prompt Caching Savings & Cost Burn Rate',
        'Repository Budget Ceilings & Governance',
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#140e0a] text-[#fbf5ee] antialiased min-h-screen flex selection:bg-amber-500 selection:text-black">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
