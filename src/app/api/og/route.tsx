import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #020509, #1e1b4b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 90, fontWeight: 900, color: '#f8fafc', marginBottom: 20 }}>
          Sivaprakash M
        </div>
        <div style={{ fontSize: 45, color: '#c084fc', marginBottom: 80 }}>
          Full Stack Developer
        </div>
        <div
          style={{
            display: 'flex',
            background: '#8b5cf6',
            color: '#ffffff',
            padding: '24px 60px',
            borderRadius: 20,
            fontSize: 36,
            fontWeight: 'bold',
            border: '2px solid rgba(192, 132, 252, 0.5)'
          }}
        >
          View Portfolio
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
