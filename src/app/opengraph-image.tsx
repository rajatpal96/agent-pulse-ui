import { ImageResponse } from 'next/og';

export const alt = 'TokenTrail | AI Agent Fleet Observability & Cost Intelligence';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: '#140e0a',
          color: '#fbf5ee',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        }}
      >
        {/* Top bar: Brand logo & tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Logo Mark */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #1c140f 0%, #0c0805 100%)',
                border: '2px solid rgba(245, 158, 11, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="10" fill="rgba(245, 158, 11, 0.4)" />
                <path
                  d="M10 20 C 10 13, 17 11, 22 15 L 28 20 C 33 24, 30 30, 24 29 C 18 28, 15 22, 20 18"
                  stroke="#fbbf24"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <path
                  d="M30 20 C 30 27, 23 29, 18 25 L 12 20 C 7 16, 10 10, 16 11 C 22 12, 25 18, 20 22"
                  stroke="#34d399"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="18" r="2.5" fill="#fbbf24" />
                <circle cx="28" cy="22" r="2.5" fill="#34d399" />
                <circle cx="20" cy="20" r="3.5" fill="#ffffff" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '36px', fontWeight: 900, letterSpacing: '-1px' }}>
                <span>Token</span>
                <span style={{ color: '#fbbf24' }}>Trail</span>
              </div>
              <div style={{ display: 'flex', fontSize: '13px', color: '#d97706', letterSpacing: '2px', fontWeight: 700 }}>
                AI FLEET OBSERVABILITY
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fde68a',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            Claude Code Telemetry Live
          </div>
        </div>

        {/* Center: Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '950px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: '54px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
            }}
          >
            Real-Time Token Usage, Exponential Trajectory & Cost Intelligence
          </div>
          <div style={{ display: 'flex', fontSize: '22px', color: '#d1c2b4', lineHeight: 1.4 }}>
            Sub-millisecond telemetry capture across autonomous coding agents, prompt cache savings, and multi-model fleet governance.
          </div>
        </div>

        {/* Bottom row: Fleet supported pill badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(245, 158, 11, 0.2)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', padding: '8px 16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.5)', color: '#fbbf24', fontSize: '14px', fontWeight: 700 }}>
              Claude Code (Live)
            </div>
            <div style={{ display: 'flex', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a89786', fontSize: '14px' }}>
              GitHub Copilot
            </div>
            <div style={{ display: 'flex', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a89786', fontSize: '14px' }}>
              Gemini / Antigravity
            </div>
            <div style={{ display: 'flex', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#a89786', fontSize: '14px' }}>
              OpenAI Codex
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: '16px', color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>
            tokentrail.xyz
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
