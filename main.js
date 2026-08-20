tsx
import React, { useState } from 'react';
// ...

const Dashboard = () => {
  // ...
  return (
    <>
      <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {/* Error state */}
        {error && (
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
                // ...
              }}
            >
              {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
            </button>
            <button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              onMouseEnter={() => setErrRetryHover(true)}
              onMouseLeave={() => setErrRetryHover(false)}
              // ...
            ></button>
          </>
        )}
        {// ...}
      </section>
      {// ...}
    </>
  );
};

// ...

export default Dashboard;