// main.js - React component with accessibility fix for multiple <main> landmarks

import React, { useState, useEffect } from 'react';

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const fetchStats = async (skipCache = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/stats' + (skipCache ? '?refresh=true' : ''));
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const copyErr = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Single main landmark wrapping all content
  return (
    <main>
      {loading && !refreshing && (
        <div className="loading-container">
          <p>Loading stats...</p>
        </div>
      )}
      
      {error && !loading && (
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
              marginLeft: '0.5rem',
              backgroundColor: errRetryHover ? '#004b73' : '#666',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {refreshing ? '再試行中...' : '🔄 再試行'}
          </button>
        </div>
      )}
      
      {stats && !error && (
        <div className="stats-container" style={{ padding: '2rem' }}>
          <h1>Stats</h1>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Active Sessions</h3>
              <p className="stat-value">{stats.activeSessions}</p>
            </div>
            <div className="stat-card">
              <h3>Page Views</h3>
              <p className="stat-value">{stats.pageViews.toLocaleString()}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setRefreshing(true);
              fetchStats(true);
            }}
            disabled={refreshing}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              cursor: refreshing ? 'wait' : 'pointer',
            }}
          >
            {refreshing ? '更新中...' : '🔄 更新'}
          </button>
        </div>
      )}
    </main>
  );
}