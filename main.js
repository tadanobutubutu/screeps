// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// StatsComponent from HEAD (preserved and integrated)
function StatsComponent({ data, error, loading, refreshing, fetchStats }) {
  const [errCopyHover, setErrCopyHover] = React.useState(false);
  const [errRetryHover, setErrRetryHover] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copyErr = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
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
          style={{
            backgroundColor: errRetryHover ? '#004b73' : '#0077b6',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '0.5rem',
            transition: 'all 0.2s ease-in-out',
            transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          {refreshing ? '🔄 更新中...' : '🔄 再試行'}
        </button>
      </div>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <section aria-label="統計データ">
        <h1 style={{ color: '#2d3748', marginBottom: '1rem' }}>統計</h1>
        <pre
          tabIndex={0}
          aria-label="統計データ詳細"
          style={{
            backgroundColor: '#f7fafc',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            fontFamily: 'monospace',
          }}
        >
          {data}
        </pre>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          aria-label={refreshing ? '更新中' : '更新'}
          style={{
            backgroundColor: refreshing ? '#a0aec0' : '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            marginTop: '1rem',
          }}
        >
          {refreshing ? '🔄 更新中...' : '🔄 更新'}
        </button>
      </section>
    </main>
  );
}

// Add the SVG with proper accessibility attributes (from origin/main)
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    style={{ position: 'absolute' }}
  >
    <title>Favicon</title>
    {/* SVG content */}
  </svg>
);

// Add the SVG with proper accessibility attributes (from origin/main)
const MetadataSVG = () => (
  <svg
    aria-hidden="true"
    width="0"
    height="0"
    style={{ position: 'absolute' }}
  >
    <title>Metadata Icon</title>
    {/* SVG content */}
  </svg>
);

// App component (from origin/main, integrated with StatsComponent)
const App = () => {
  return (
    <div>
      <StatsComponent
        data={null}
        error={null}
        loading={false}
        refreshing={false}
        fetchStats={() => {}}
      />
      {/* Other existing components can be added here */}
    </div>
  );
};

// Exports (preserved from origin/main, with StatsComponent added as named export)
export default App;
export { FaviconSVG, MetadataSVG, StatsComponent };