import React, { useState } from 'react';
import { copyErr } from './utils';

function Dashboard() {
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  // ... other logic (e.g., fetchStats, etc.)

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Keep a single <main> landmark as required by REACT_025 */}
      <main>
        {error ? (
          <>
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
            />
          </>
        ) : (
          <>
            {/* Use <section> for non‑main content to avoid additional landmarks */}
            <section>
              {/* Success state UI goes here */}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;