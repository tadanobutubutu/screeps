'use client';
import { useEffect, useState, useCallback } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null),
        [error, setError] = useState<string | null>(null),
        [loading, setLoading] = useState(true),
        [refreshing, setRefreshing] = useState(false),
        [copied, setCopied] = useState(false),
        [focused, setFocused] = useState(false),
        [refreshFocused, setRefreshFocused] = useState(false),
        [retryFocused, setRetryFocused] = useState(false);

    const fetchData = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setError(null);
        try {
            const r = await fetch('/api/screeps?endpoint=overview');
            const d = await r.json();
            if (!r.ok || d.error) throw new Error(d.error || `エラー: ${r.status}`);
            setStats(d);
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
    if (error)
        return (
            <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
                <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
                <div style={{ display: 'flex', gap: '1rem' }}>
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
                    <button
                        onClick={() => fetchData(false)}
                        onFocus={() => setRetryFocused(true)}
                        onBlur={() => setRetryFocused(false)}
                        aria-label="再試行"
                        style={{
                            backgroundColor: '#4a5568',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: retryFocused ? '0 0 0 3px rgba(74, 85, 104, 0.4)' : 'none',
                        }}
                    >
                        🔄 再試行
                    </button>
                </div>
            </main>
        );
    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ color: '#004b73' }}>🐛 Screeps ダッシュボード</h1>
                <button
                    onClick={() => fetchData(true)}
                    onFocus={() => setRefreshFocused(true)}
                    onBlur={() => setRefreshFocused(false)}
                    aria-label={refreshing ? '更新中...' : 'データを更新'}
                    title={refreshing ? '更新中...' : 'データを更新'}
                    disabled={refreshing}
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: refreshing ? 'default' : 'pointer',
                        fontSize: '1.5rem',
                        padding: '4px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s',
                        boxShadow: refreshFocused ? '0 0 0 3px rgba(0, 75, 115, 0.4)' : 'none',
                        outline: 'none',
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
                </button>
            </div>
            <div
                style={{
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
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
