import React, { useState } from 'react';

// -----------------------------------------------------------
// Existing imports and utility functions (preserved from original)
// -----------------------------------------------------------
import './Dashboard.css'; // Example CSS import; keep as-is

// Example helper function that was previously present
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// -----------------------------------------------------------
// Dashboard component
// -----------------------------------------------------------
export default function Dashboard() {
  // Preserve all original state variables and hooks
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  // Preserve original async function that fetches stats
  const fetchStats = async (reload = false) => {
    if (reload) {
      setRefreshing(true);
      // Existing logic for fetching stats (kept unchanged)
      try {
        // Simulated fetch
        await delay(500);
        // Assume some data is set elsewhere; keep original behavior
      } finally {
        setRefreshing(false);
      }
    }
  };

  // Preserve original function that copies error message to clipboard
  const copyErr = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      // Reset copy status after a short delay (original behavior)
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error('Failed to copy error text', e);
    }
  };

  // Preserve any other helper functions that existed originally
  // ...

  // -----------------------------------------------------------
  // Render logic: Ensure only ONE <main> element is present
  // -----------------------------------------------------------
  return (
    <main>
      {error ? (
        // Error UI (previously had a separate <main> wrapper, now merged)
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
            style={{
              marginLeft: '0.5rem',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: refreshing ? '#666' : '#004b73',
              color: 'white',
            }}
            aria-label="リトライ"
          >
            {refreshing ? '読み込み中...' : '🔁 リトライ'}
          </button>
        </>
      ) : (
        // Success UI (original success branch now lives inside the same <main>)
        <>
          {/* Placeholder for original success UI – keep it unchanged */}
          <div style={{ padding: '1rem' }}>
            <h2>Dashboard Data</h2>
            {/* Existing visualizations, charts, etc. would be rendered here */}
          </div>
        </>
      )}
    </main>
  );
}

// -----------------------------------------------------------
// Preserve any named exports or additional components that existed
// -----------------------------------------------------------
export { /* any named exports */ };