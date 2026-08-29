import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LLM Model Efficiency & Token Pricing Analytics',
  description: 'Analyze prompt tokens, completion generation, reasoning overhead, and prompt caching savings across Claude 3.7 Sonnet, GPT-4o, Gemini 2.5 Pro, and Grok.',
  alternates: {
    canonical: '/models',
  },
  openGraph: {
    title: 'Model & Token Efficiency Analytics | TokenTrail',
    description: 'Analyze prompt tokens, completion generation, reasoning overhead, and prompt caching savings across LLM providers.',
    url: 'https://tokentrail.xyz/models',
  },
};

export default function ModelsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
