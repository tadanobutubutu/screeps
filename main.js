import React, { useState, useCallback, useEffect } from 'react';

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);
  const [refreshHover, setRefreshHover] = useState(false);

  const copyErr = useCallback(() => {
    if (error) {
      navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [error]);

  const fetchStats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch('/api/stats');
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#004b73' }}>読み込み中...</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '3px solid #004b73',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
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
          onFocus={() => setErrRetryHover(true)}
          onBlur={() => setErrRetryHover(false)}
          style={{
            backgroundColor: refreshing ? '#666' : '#b71c1c',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease-in-out',
            transform: errRetryHover && !refreshing ? 'scale(1.05)' : 'scale(1)',
            boxShadow: errRetryHover && !refreshing ? '0 4px 10px rgba(183, 28, 28, 0.3)' : 'none',
            marginLeft: '0.5rem',
          }}
        >
          {refreshing ? '🔄 リトライ中...' : '🔄 リトライ'}
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#004b73' }}>📊 統計</h1>
      <div style={{ marginTop: '1rem' }}>
        <div
          style={{
            backgroundColor: '#f0f4f8',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ color: '#666' }}>総打刻数: </span>
          <span style={{ fontWeight: 'bold', color: '#004b73' }}>{stats.total}</span>
        </div>
        <div
          style={{
            backgroundColor: '#f0f4f8',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '0.5rem',
          }}
        >
          <span style={{ color: '#666' }}>出勤: </span>
          <span style={{ fontWeight: 'bold', color: '#155d27' }}>{stats.in}</span>
        </div>
        <div
          style={{
            backgroundColor: '#f0f4f8',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <span style={{ color: '#666' }}>退勤: </span>
          <span style={{ fontWeight: 'bold', color: '#b71c1c' }}>{stats.out}</span>
        </div>
      </div>
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => setRefreshHover(true)}
        onMouseLeave={() => setRefreshHover(false)}
        style={{
          backgroundColor: refreshing ? '#666' : '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: refreshing ? 'not-allowed' : 'pointer',
          marginTop: '1rem',
          transition: 'all 0.2s ease-in-out',
          transform: refreshHover && !refreshing ? 'scale(1.05)' : 'scale(1)',
          boxShadow: refreshHover && !refreshing ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
        }}
      >
        {refreshing ? '🔄 更新中...' : '🔄 更新'}
      </button>
    </div>
  );
}