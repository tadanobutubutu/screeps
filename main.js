import React, { useState, useCallback } from 'react';
import { useStats } from '../hooks/useStats';

export const StatsView = ({ onDismiss }) => {
  const [stats, setStats] = useStats();
  const [refreshInterval, setRefreshInterval] = useState(stats?.meta?.refresh_interval ?? 0);
  const [refreshTimeout, setRefreshTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // エラーステート用
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  // 成功ステート用
  const [copyHover, setCopyHover] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const fetchStats = useCallback((force = false) => {
    setRefreshing(true);
    setError(null);
    setStats({ force }).then((s) => {
      setRefreshing(false);
      if (s?.error) setError(s.error);
    });
  }, [setStats]);

  const copyStats = useCallback(async () => {
    if (stats) {
      await navigator.clipboard.writeText(JSON.stringify(stats, null, 2));
      setCopyHover(false);
    }
  }, [stats]);

  const copyErr = useCallback(async () => {
    if (error) {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [error]);

  const handleRefreshIntervalChange = (interval: number) => {
    setRefreshInterval(interval);
    if (refreshTimeout) clearTimeout(refreshTimeout);
    if (interval > 0) {
      const timeout = setTimeout(() => fetchStats(true), interval * 1000);
      setRefreshTimeout(timeout);
    }
  };

  if (error) {
    return (
      <section style={{ padding: '2rem', fontFamily: 'monospace' }} aria-label="エラー表示">
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
                backgroundColor: errRetryHover ? '#002d4d' : '#004b73',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '0.5rem',
                transition: 'all 0.2s ease-in-out',
                transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                filter: errRetryHover ? 'brightness(1.1)' : 'none',
            }}
        >
            {refreshing ? '🔄 リフレッシュ中...' : '🔄 リトライ'}
        </button>
        <button
            onClick={onDismiss}
            style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '0.5rem',
            }}
        >
            ✖️ 閉じる
        </button>
      </section>
    );
  }

  if (!stats) {
    return (
      <section style={{ padding: '2rem', fontFamily: 'monospace' }} aria-label="データ読み込み中">
        <h1 style={{ color: '#2563eb' }}>🔄 読み込み中...</h1>
        <button
            onClick={() => fetchStats()}
            disabled={refreshing}
        >
            {refreshing ? '🔄 リフレッシュ中...' : '🔄 リフレッシュ'}
        </button>
      </section>
    );
  }

  const renderTable = (data: any, title: string) => {
    if (!data || typeof data !== 'object') return null;
    const entries = Object.entries(data);

    return (
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>項目</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #d1d5db' }}>値</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value]) => (
              <tr
                key={key}
                onMouseEnter={() => setHoveredRow(key)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  backgroundColor: hoveredRow === key ? '#f9fafb' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>{key}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid #e5e7eb' }}>
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>📊 統計</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={copyStats}
            onMouseEnter={() => setCopyHover(true)}
            onMouseLeave={() => setCopyHover(false)}
            onFocus={() => setCopyHover(true)}
            onBlur={() => setCopyHover(false)}
            aria-label="統計をクリップボードにコピー"
            title="統計をクリップボードにコピー"
            style={{
              backgroundColor: copyHover ? '#155d27' : '#004b73',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              transform: copyHover ? 'scale(1.05)' : 'scale(1)',
              boxShadow: copyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
              filter: copyHover ? 'brightness(1.1)' : 'none',
            }}
          >
            📋 コピー
          </button>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            onMouseEnter={() => setCopyHover(true)}
            onMouseLeave={() => setCopyHover(false)}
            style={{
              backgroundColor: '#004b73',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {refreshing ? '🔄 リフレッシュ中...' : '🔄 リフレッシュ'}
          </button>
          <select
            value={refreshInterval}
            onChange={(e) => handleRefreshIntervalChange(Number(e.target.value))}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
            }}
            aria-label="自動更新間隔"
          >
            <option value={0}>自動更新: オフ</option>
            <option value={5}>自動更新: 5秒</option>
            <option value={10}>自動更新: 10秒</option>
            <option value={30}>自動更新: 30秒</option>
            <option value={60}>自動更新: 1分</option>
          </select>
          <button
            onClick={onDismiss}
            aria-label=" статистику"
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✖️ 閉じる
          </button>
        </div>
      </div>

      {stats.meta && renderTable(stats.meta, 'メタデータ')}
      {stats.data && render