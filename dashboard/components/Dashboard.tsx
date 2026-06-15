'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null),
        [error, setError] = useState<string | null>(null),
        [loading, setLoading] = useState(true),
        [refreshing, setRefreshing] = useState(false),
        [lastUpdated, setLastUpdated] = useState<string | null>(null),
        [copied, setCopied] = useState(false),
        [focused, setFocused] = useState(false);

    const loadData = (init = false) => {
        if (init) setLoading(true);
        else setRefreshing(true);
        fetch('/api/screeps?endpoint=overview')
            .then(async (r) => {
                const d = await r.json();
                if (!r.ok || d.error) throw new Error(d.error || `エラー: ${r.status}`);
                return d;
            })
            .then((d) => {
                setStats(d);
                setLastUpdated(new Date().toLocaleTimeString('ja-JP'));
                setError(null);
            })
            .catch((e) => setError(e.message || String(e)))
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    };

    useEffect(() => loadData(true), []);
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ color: '#004b73' }}>🐛 Screeps ダッシュボード</h1>
                <button
                    onClick={() => loadData()}
                    disabled={refreshing}
                    aria-label={refreshing ? '更新中' : 'データを更新'}
                    className="interactive-hint"
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #004b73',
                        color: '#004b73',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: refreshing ? 'wait' : 'pointer',
                    }}
                >
                    <span style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>
                        🔄
                    </span>
                    {refreshing ? '更新中' : '更新'}
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
                {lastUpdated && <small style={{ color: '#718096' }}>最終更新: {lastUpdated}</small>}
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
