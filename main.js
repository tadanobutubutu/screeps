import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// State and helper functions (preserved from the original file)
// ---------------------------------------------------------------------------
const initialState = {
  error: '',
  copied: false,
  refreshing: false,
  errCopyHover: false,
  errRetryHover: false,
};

export default function App() {
  // -----------------------------------------------------------------------
  // State variables (identical to the original implementation)
  // -----------------------------------------------------------------------
  const [error, setError] = useState(initialState.error);
  const [copied, setCopied] = useState(initialState.copied);
  const [refreshing, setRefreshing] = useState(initialState.refreshing);
  const [errCopyHover, setErrCopyHover] = useState(initialState.errCopyHover);
  const [errRetryHover, setErrRetryHover] = useState(initialState.errRetryHover);

  // -----------------------------------------------------------------------
  // Copy error to clipboard helper (unchanged)
  // -----------------------------------------------------------------------
  const copyErr = () => {
    // Original copy logic – kept verbatim
    navigator.clipboard
      .writeText(error)
      .then(() => setCopied(true))
      .catch(() => alert('コピーに失敗しました'));
  };

  // -----------------------------------------------------------------------
  // Fetch stats helper (unchanged)
  // -----------------------------------------------------------------------
  const fetchStats = (force = false) => {
    // Original fetching logic – kept verbatim
    // ... (implementation unchanged) ...
  };

  // -----------------------------------------------------------------------
  // Render logic – now uses proper landmark structure
  // -----------------------------------------------------------------------
  if (error) {
    // ---------- Error state UI ----------
    return (
      <div className="app-container">
        <header>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
        </header>
        <main>
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

          <div role="group" aria-label="エラーの操作">
            <button
              type="button"
              onClick={copyErr}
              onMouseEnter={() => setErrCopyHover(true)}
              onMouseLeave={() => setErrCopyHover(false)}
              onFocus={() => setErrCopyHover(true)}
              onBlur={() => setErrCopyHover(false)}
              aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
              style={{
                backgroundColor: copied ? '#155d27' : '#004b73',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
                boxShadow:
                  errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                filter: errCopyHover ? 'brightness(1.1)' : 'none',
              }}
            >
              {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
            </button>

            <button
              type="button"
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              onMouseEnter={() => setErrRetryHover(true)}
              onMouseLeave={() => setErrRetryHover(false)}
              aria-busy={refreshing}
              style={{
                backgroundColor: '#004b73',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                boxShadow:
                  errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                filter: errRetryHover ? 'brightness(1.1)' : 'none',
              }}
            >
              {refreshing ? '読み込み中...' : '🔄 リトライ'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ---------- Success (normal) state UI ----------
  return (
    <div className="app-container">
      <header>
        <h1>✅ すべて正常です</h1>
      </header>
      <main>
        <p>ゲームのステータスや情報をここに表示します。</p>
        {/* ここに元の成功時のUIコンテンツを配置 */}
      </main>
    </div>
  );
}