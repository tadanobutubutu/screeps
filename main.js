tsx
import React, { useState, useEffect } from 'react';
import DependantGraph from './DependantGraph';
import ErrorBoundary from './ErrorBoundary';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './Dashboard.css';

const Dashboard = () => {
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
        .then(() => {
          setRefreshing(false);
        })
        .catch((err) => {
          setError(String(err));
          setRefreshing(false);
        });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async (reload = false) => {
    setRefreshing(true);
    // Fetch stats when component mounts and whenever the reload variable is true
    // ... Your fetchStats logic here ...
  };

  return (
    <div id="dashboard-wrapper" className="main-wrapper">
      <ErrorBoundary>
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1>Stat Tracker</h1>
          {/* Your stat tracker content here */}
        </main>
      </ErrorBoundary>
      <div id="error-wrapper" style={{ padding: '2rem', display: error ? 'block' : 'none' }}>
        <main aria-label="エラーメッセージ" style={{ fontFamily: 'monospace' }}>
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
            {refreshing ? '再取得中...' : '再取得'}
          </button>
        </main>
        <DependantGraph />
      </div>
    </div>
  );
};

export default Dashboard;