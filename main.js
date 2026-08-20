tsx
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);

    const fetchStats = async (force = false) => {
        if (refreshing && !force) return;
        setRefreshing(true);
        try {
            const response = await fetch('/api/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
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

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {error ? (
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
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '1rem',
                            transition: 'all 0.2s ease-in-out',
                            transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                            filter: errRetryHover ? 'brightness(1.1)' : 'none',
                        }}
                    >
                        {refreshing ? '🔄 再試行中...' : '🔄 再試行'}
                    </button>
                </>
            ) : stats ? (
                <>
                    <h1 style={{ color: '#004b73' }}>📊 ダッシュボード</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {Object.entries(stats).map(([key, value]) => (
                            <div key={key} style={{ backgroundColor: '#f0f4f8', padding: '1rem', borderRadius: '4px' }}>
                                <h3 style={{ marginTop: 0, color: '#004b73' }}>{key}</h3>
                                <p style={{ marginBottom: 0, fontSize: '1.2rem' }}>{value}</p>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => fetchStats(true)}
                        disabled={refreshing}
                        style={{
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem',
                        }}
                    >
                        {refreshing ? '🔄 更新中...' : '🔄 データを更新'}
                    </button>
                </>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <div className="spinner" style={{ border: '4px solid rgba(0, 0, 0, 0.1)', borderRadius: '50%', borderTop: '4px solid #004b73', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                </div>
            )}
        </main>
    );
};

export default Dashboard;