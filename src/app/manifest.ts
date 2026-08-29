import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TokenTrail | AI Agent Fleet Observability & Cost Intelligence',
    short_name: 'TokenTrail',
    description: 'Unified AI coding-agent usage, token metrics, cost intelligence, and fleet observability across Claude Code, GitHub Copilot, Gemini, and Grok.',
    start_url: '/',
    display: 'standalone',
    background_color: '#140e0a',
    theme_color: '#140e0a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
