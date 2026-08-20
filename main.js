import React from 'react';

// [PRESERVED EXISTING EXPORTS AND FUNCTIONS HERE]

export default function Dashboard() {
  // ... [EXISTING COMPONENT CODE UP TO LINE 306] ...

  // MERGED ERROR/SUCCESS RENDER PATH WITH SINGLE <main>
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
              overflow: 'auto'
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
              boxShadow: errCopyHover
                ? '0 4px 10px rgba(0, 75, 115, 0.3)'
                : 'none',
              filter: errCopyHover ? 'brightness(1.1)' : 'none'
            }}
          >
            {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
          </button>

          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            onMouseEnter={() => setErrRetryHover(true)}
            onMouseLeave={() => setErrRetryHover(false)}
            /* ... [REST OF BUTTON STYLES FROM SUCCESS STATE] ... */
          >
            {refreshing ? '再読み込み中...' : 'リクエストの再試行'}
          </button>
        </>
      ) : (
        <h1>ダッシュボード</h1>
        {/* Rest of success state content */}
      )}
    </main>
  );
}

// [PRESERVED COMPONENT CODE AFTER LINE 306] ...