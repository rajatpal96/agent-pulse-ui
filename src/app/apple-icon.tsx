import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1c140f 0%, #0c0805 100%)',
          borderRadius: 44,
          border: '4px solid rgba(245, 158, 11, 0.7)',
          position: 'relative',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="12" fill="rgba(245, 158, 11, 0.35)" />
          <path
            d="M10 20 C 10 13, 17 11, 22 15 L 28 20 C 33 24, 30 30, 24 29 C 18 28, 15 22, 20 18"
            stroke="#fbbf24"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30 20 C 30 27, 23 29, 18 25 L 12 20 C 7 16, 10 10, 16 11 C 22 12, 25 18, 20 22"
            stroke="#34d399"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="18" r="2.5" fill="#fbbf24" />
          <circle cx="28" cy="22" r="2.5" fill="#34d399" />
          <circle cx="20" cy="20" r="3.5" fill="#ffffff" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
