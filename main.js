import React, { useState, useEffect } from 'react';

export default function StatsPanel({ stats, onRefresh, loading, error: errorProp }) {
    const [copied, setCopied] = useState(false);
    const [copyHover, setCopyHover] = useState(false);
    const [retryHover, setRetryHover] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [localError, setLocalError] = useState(null);

    const error = errorProp || localError;

    useEffect(() => {
        if (stats && stats.error) {
            setLocalError(stats.error);
        }
    }, [stats]);

    const copyStats = () => {
        navigator.clipboard.writeText(JSON.stringify(stats, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchStats = (manual = false) => {
        if (manual) {
            setRefreshing(true);
        }
        onRefresh();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getGclLevel = (gcl) => {
        const levels = [0, 100000, 250000, 500000, 1250000, 2500000, 5000000, 12500000, 25000000];
        for (let i = levels.length - 1; i >= 0; i--) {
            if (gcl >= levels[i]) return i + 1;
        }
        return 1;
    };

    if (error) {
        return (
            <main>
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
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: refreshing ? 'not-allowed' : 'pointer',
                            opacity: refreshing ? 0.6 : 1,
                            marginLeft: '0.5rem',
                            transition: 'all 0.2s ease-in-out',
                            transform: errRetryHover && !refreshing ? 'scale(1.05)' : 'scale(1)',
                        }}
                    >
                        {refreshing ? '🔄 更新中...' : '🔄 再試行'}
                    </button>
                </div>
            </main>
        );
    }

    if (!stats) {
        return (
            <main>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>データを読み込み中...</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className="stats-container" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>📊 Screeps Stats</h1>
                    <button
                        onClick={() => fetchStats(true)}
                        onMouseEnter={() => setCopyHover(true)}
                        onMouseLeave={() => setCopyHover(false)}
                        disabled={refreshing || loading}
                        style={{
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none