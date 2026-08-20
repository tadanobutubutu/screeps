// app/favicon.ts (new file for favicon SVG with accessible name)
import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/svg+xml';

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="App favicon"
      >
        <title>App favicon</title>
        <rect width="32" height="32" rx="8" fill="#3B82F6" />
        <path
          d="M8 24V8L16 20L24 8V24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    {
      ...size,
    }
  );
}

// reusable Icon component with accessible name
export function Icon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Application logo"
    >
      <title>Application logo</title>
      <path
        d="M4 20V4L12 16L20 4V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// New component to handle error display without main landmark
export function ErrorDisplay({ error, copyErr, copied, refreshing, fetchStats, setErrCopyHover, setErrRetryHover, errCopyHover }: {
  error: string;
  copyErr: () => void;
  copied: boolean;
  refreshing: boolean;
  fetchStats: (force?: boolean) => void;
  setErrCopyHover: (hover: boolean) => void;
  setErrRetryHover: (hover: boolean) => void;
  errCopyHover: boolean;
}) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
      <pre
        tabIndex={0}
        aria-label="エラーメッセージ詳細"
        style={{
          color: '#c53030',
          backgroundColor: '#fff5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      >
        {error}
      </pre>
      <button
        onClick={copyErr}
        onMouseEnter={() => setErrCopyHover(true)}
        onMouseLeave={() => setErrCopyHover(false)}
        onFocus={() => setErrCopyHover(true)}
        onBlur={() => setErrCopyHover(false)}
        aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
        title={copied ? 'コピー済み' : 'エラーをコピー'}
        style={{
          backgroundColor: copied ? '#155d27' : '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
          boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
          filter: errCopyHover ? 'brightness(1.1)' : 'none',
        }}
      >
        {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
      </button>
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => setErrRetryHover(true)}
        onMouseLeave={() => setErrRetryHover(false)}
        aria-label="再試行"
        style={{
          backgroundColor: '#38a169',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '1rem',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        再試行
      </button>
    </div>
  );
}