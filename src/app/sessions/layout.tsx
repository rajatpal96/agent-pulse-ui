import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent Coding Sessions Explorer & Workflow Timelines',
  description: 'Explore chronological coding agent workflow sessions, tool call duration, token burn, and step-by-step developer trajectories.',
  alternates: {
    canonical: '/sessions',
  },
  openGraph: {
    title: 'AI Agent Sessions Explorer | TokenTrail',
    description: 'Deep-dive into step durations, tool invocations, token costs, and full developer coding workflows.',
    url: 'https://www.tokentrail.xyz/sessions',
  },
};

export default function SessionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
