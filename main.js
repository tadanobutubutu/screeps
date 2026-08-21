// Assuming this is a React component that needs to be fixed
// The issue states there are TWO <main> elements - one in error state and one in success state
// Fix: Use a single <main> wrapper and use <section> or <article> for internal sections

import React, { useState } from 'react';

const SomeComponent = ({ error, data, fetchStats }) => {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    ...
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {error ? (
        <section aria-labelledby="error-heading">
          <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
            onMouseLeave={() => ...
            onFocus={() => setErrCopyHover(true)}
            onBlur={() => ...
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
            style={{
              marginLeft: '0.5rem',
              backgroundColor: '#004b73',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            再試行
          </button>
        </section>
      ) : (
        <article ...
          <h1 id="success-heading" style={{ color: '#2e7d32' }}>✅ 成功</h1>
          <div>
            {data && ...
          </div>
          <button
            id="unrotate"
            onClick={() => fetchStats(false)}
            style={{
              backgroundColor: 'transparent',
              color: '#004b73',
              padding: '0.5rem 1rem',
              border: '1px solid #004b73',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            rotate back
          </button>
        </article>
      )}
    </main>
  );
};

export default SomeComponent;