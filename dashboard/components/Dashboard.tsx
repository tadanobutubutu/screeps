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
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        fetch('/api/screeps?endpoint=overview')
            .then(async (r) => {
                const d = await r.json();
                if (!r.ok || d.error) throw new Error(d.error || `エラー: ${r.status}`);
                return d;
            })
            .then((d) => setStats(d))
            .catch((e) => setError(e.message || String(e)))
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);
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
                <button
                    onClick={() => fetchData(true)}
                    onFocus={() => setRefreshFocused(true)}
                    onBlur={() => setRefreshFocused(false)}
                    disabled={refreshing}
                    aria-label={refreshing ? '更新中...' : '情報を更新'}
                    title={refreshing ? '更新中...' : '情報を更新'}
                    style={{
                        backgroundColor: 'white',
                        color: '#004b73',
                        padding: '0.5rem',
                        border: '1px solid #004b73',
                        borderRadius: '4px',
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        outline: 'none',
                        boxShadow: refreshFocused ? '0 0 0 3px rgba(0, 75, 115, 0.4)' : 'none',
                        transition: 'all 0.2s ease',
                        opacity: refreshing ? 0.7 : 1,
                    }}
                >
                    <span
                        style={{
                            display: 'inline-block',
                            animation: refreshing ? 'spin 1s linear infinite' : 'none',
                        }}
                        aria-hidden="true"
                    >
                        {refreshing ? '⏳' : '🔄'}
                    </span>
                    <span style={{ fontWeight: 'bold' }}>{refreshing ? '更新中...' : '更新'}</span>
                </button>
            </div>
            <div
                style={{
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
                    opacity: refreshing ? 0.6 : 1,
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
                <summary
                    className="interactive-hint"
                    style={{
                        color: '#4a5568',
                        outline: 'none',
                        width: 'fit-content',
                    }}
                >
                    生データを確認
                </summary>
                <pre
                    tabIndex={0}
                    aria-label="Screeps API 生データ"
                    style={{
                        backgroundColor: '#f7fafc',
                        padding: '1rem',
                        borderRadius: '4px',
                        marginTop: '0.5rem',
                        overflow: 'auto',
                        border: '1px solid #edf2f7',
                        maxHeight: '400px',
                    }}
                >
                    {JSON.stringify(stats, null, 2)}
                </pre>
            </details>
        </main>
    );
}
