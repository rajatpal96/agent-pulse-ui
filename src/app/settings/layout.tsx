import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspace Configuration & Telemetry API Keys',
  description: 'Manage organization telemetry tokens, ingestion API keys, team member access, and notification webhooks in TokenTrail.',
  alternates: {
    canonical: '/settings',
  },
  openGraph: {
    title: 'Workspace Settings | TokenTrail',
    description: 'Manage organization tokens, ingestion API keys, and notification webhooks.',
    url: 'https://tokentrail.xyz/settings',
  },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
