'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null),
        [error, setError] = useState<string | null>(null),
        [loading, setLoading] = useState(true),
        [refreshing, setRefreshing] = useState(false),
        [copied, setCopied] = useState(false),
        [focused, setFocused] = useState(false),
        [refreshFocused, setRefreshFocused] = useState(false);

    const fetchData = (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        else setRefreshing(true);
        setError(null);

        fetch('/api/screeps?endpoint=overview')
            .then(async (r) => {
                const d = await r.json();
                if (!r.ok || d.error) throw new Error(d.error || `エラー: ${r.status}`);
                return d;
            })
            .then(setStats)
            .catch((e) => setError(e.message || String(e)))
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    };

    useEffect(() => fetchData(), []);

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

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: '#004b73', margin: 0 }}>🐛 Screeps ダッシュボード</h1>
                <button
                    onClick={() => fetchData(true)}
                    onFocus={() => setRefreshFocused(true)}
                    onBlur={() => setRefreshFocused(false)}
                    disabled={refreshing}
                    aria-label={refreshing ? '更新中...' : 'データを更新'}
                    title={refreshing ? '更新中...' : 'データを更新'}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        padding: '0.5rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: refreshFocused ? 'rgba(0, 75, 115, 0.1)' : 'transparent',
                        boxShadow: refreshFocused ? '0 0 0 3px rgba(0, 75, 115, 0.4)' : 'none',
                        outline: 'none',
                    }}
                >
                    <span
                        style={{
                            fontSize: '1.5rem',
                            display: 'inline-block',
                            animation: refreshing ? 'spin 1s linear infinite' : 'none',
                            color: '#004b73',
                        }}
                    >
                        ↻
                    </span>
                </button>
            </div>
            {error ? (
                <div style={{ marginTop: '1rem' }}>
                    <h2 style={{ color: '#b71c1c' }}>⚠️ エラー</h2>
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
                            onClick={() => fetchData()}
                            aria-label="再試行"
                            style={{
                                backgroundColor: '#004b73',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            🔄 再試行
                        </button>
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
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        marginTop: '1rem',
                        marginBottom: '1rem',
                        border: '1px solid #e2e8f0',
                        padding: '1rem',
                        borderRadius: '8px',
                        opacity: refreshing ? 0.6 : 1,
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
            )}
            <details style={{ cursor: 'pointer', marginTop: '1rem' }}>
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
