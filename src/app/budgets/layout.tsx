import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Cost Governance & Spend Budget Ceilings',
  description: 'Set hard and soft budget limits by repository, developer team, and LLM model provider with automated spend alerts.',
  alternates: {
    canonical: '/budgets',
  },
  openGraph: {
    title: 'AI Spend Governance & Budgets | TokenTrail',
    description: 'Real-time spend allocation by repository, model provider, and developer team with budget ceilings.',
    url: 'https://www.tokentrail.xyz/budgets',
  },
};

export default function BudgetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
