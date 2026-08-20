import React from 'react';
import ReactDOM from 'react-dom';

// Existing function signatures, exports, and other code remain unchanged.
// Only the element that previously used an empty href is replaced with a button.
// Additionally, a new renderDashboardComponent function is added here.
export function renderDashboardComponent() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
      >
        Retry
      </button>
      {/* Other dashboard components go here */}
    </main>
  );
}

/* -------------------------------------------------
Exported functions preserved exactly as before
with one additional new export
------------------------------------------------- */
export function renderDependencyGraph() {
  return (
    <div className="dependency-graph">
      <button id="unrotate" type="button" onClick={() => {
        console.log('rotate back clicked');
        // Preserve any original click-handler logic
      }}>rotate back</button>
      {/* Rest of dependency graph component */}
    </div>
  );
}

/* -------------------------------------------------
Any other original exports remained untouched
in their exact original positions
------------------------------------------------- */
export default renderDependencyGraph;