'use client';
import { useEffect, useState, useCallback } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null),
        [error, setError] = useState<string | null>(null),
        [loading, setLoading] = useState(true),
        [refreshing, setRefreshing] = useState(false),
        [copied, setCopied] = useState(false),
        [focused, setFocused] = useState(false),
        [refreshFocused, setRefreshFocused] = useState(false);

    const fetchData = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const token = typeof window !== 'undefined' ? sessionStorage.getItem('dashboard_token') : null;
            const res = await fetch('/api/screeps?endpoint=overview', {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error || `Error: ${res.status}`);
            setStats(data);
        } catch (e: any) {
            setError(e.message || String(e));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const copyErr = () =>
        error &&
        navigator.clipboard.writeText(error).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });

    if (loading)
        return (
            <p aria-live="polite" style={{ padding: '2rem', fontFamily: 'monospace' }}>
                読み込み中...
            </p>
        );

    const RefreshBtn = ({ label = '更新', small = false }) => (
        <button
            onClick={() => fetchData(true)}
            onFocus={() => setRefreshFocused(true)}
            onBlur={() => setRefreshFocused(false)}
            disabled={refreshing}
            aria-label={refreshing ? '更新中' : label}
            style={{
                backgroundColor: 'transparent',
                color: '#004b73',
                border: '1px solid #004b73',
                padding: small ? '0.25rem 0.5rem' : '0.5rem',
                borderRadius: '4px',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: refreshFocused ? '0 0 0 3px rgba(0, 75, 115, 0.4)' : 'none',
                transition: 'all 0.2s ease',
            }}
        >
            <span
                style={{
                    display: 'inline-block',
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                }}
            >
                🔄
            </span>
            {small && (refreshing ? '更新中...' : label)}
        </button>
    );

    if (error)
        return (
            <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h1 style={{ color: '#b71c1c', margin: 0 }}>⚠️ エラー</h1>
                    <RefreshBtn label="再試行" small />
                </div>
                <pre
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
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
                    style={{
                        backgroundColor: copied ? '#155d27' : '#004b73',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: focused ? '0 0 0 3px rgba(0, 75, 115, 0.4)' : 'none',
                    }}
                >
                    {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
                </button>
            </main>
        );

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                }}
            >
                <h1 style={{ color: '#004b73', margin: 0 }}>🐛 Screeps ダッシュボード</h1>
                <RefreshBtn />
            </div>
            <div
                style={{
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
                    opacity: refreshing ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                }}
            >
                <p>
                    🌐 GCL: {stats?.gcl?.level} (
                    {stats?.gcl?.progressTotal
                        ? Math.floor((stats?.gcl?.progress / stats?.gcl?.progressTotal) * 100)
                        : 0}
                    %)
                </p>
                <p>📊 CPU 使用率: {stats?.cpuUsed?.toFixed(2)}</p>
                <p>
                    🏘️ {stats?.rooms?.length === 1 ? '部屋' : '部屋数'}: {stats?.rooms?.length || 0}
                </p>
            </div>
            <details style={{ cursor: 'pointer' }}>
                <summary style={{ color: '#4a5568', outline: 'none' }}>生データを確認</summary>
                <pre
                    style={{
                        backgroundColor: '#f7fafc',
                        padding: '1rem',
                        borderRadius: '4px',
                        marginTop: '0.5rem',
                        overflow: 'auto',
                    }}
                >
                    {JSON.stringify(stats, null, 2)}
                </pre>
            </details>
        </main>
    );
}
