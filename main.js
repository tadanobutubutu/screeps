import React from 'react';

function App() {
  // State for error handling
  const [error, setError] = React.useState(null);
  const [stats, setStats] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [errCopyHover, setErrCopyHover] = React.useState(false);
  const [errRetryHover, setErrRetryHover] = React.useState(false);

  // Copy error to clipboard
  const copyErr = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fetch stats function
  const fetchStats = async (retry = false) => {
    setRefreshing(true);
    try {
      // Simulated fetch - replace with actual API call
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setStats(null);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        {/* Single main landmark with sections for different states */}
        <main>
          {error ? (
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
                onFocus={() => setErrRetryHover(true)}
                onBlur={() => setErrRetryHover(false)}
                aria-label="統計を再取得"
                title="統計を再取得"
                style={{
                  backgroundColor: '#004b73',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '0.5rem',
                  transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {refreshing ? '🔄 更新中...' : '🔄 再試行'}
              </button>
            </section>
          ) : (
            <section style={{ padding: '2rem' }}>
              <h1>Statistics Dashboard</h1>
              <div>{stats ? JSON.stringify(stats, null, 2) : 'Loading...'}</div>
              <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                aria-label="データを更新"
              >
                {refreshing ? '🔄 更新中...' : '🔄 更新'}
              </button>
            </section>
          )}
        </main>
      </body>
    </html>
  );
}

export default App;