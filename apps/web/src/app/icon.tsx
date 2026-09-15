import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          borderRadius: '8px',
        }}
      >
        <div
          style={{
            width: '50%',
            height: '50%',
            background: '#2563eb', // blue-600
            borderRadius: '2px',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
