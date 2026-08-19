// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// New component for the rotate back button
export function RotateBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button id="unrotate" onClick={onClick}>
      rotate back
    </button>
  );
}

// New component for error display (replaces the duplicate main in Dashboard.tsx)
export function ErrorDisplay({ error, copyErr, copied, refreshing, fetchStats }: {
  error: string;
  copyErr: () => void;
  copied: boolean;
  refreshing: boolean;
  fetchStats: (force?: boolean) => void;
}) {
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  return (
    <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
        title="再試行"
        style={{
          backgroundColor: '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '1rem',
          transition: 'all 0.2s ease-in-out',
          transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
          boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
          filter: errRetryHover ? 'brightness(1.1)' : 'none',
        }}
      >
        再試行
      </button>
    </section>
  );
}