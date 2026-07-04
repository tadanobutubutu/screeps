'use client';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null),
        [error, setError] = useState<string | null>(null),
        [loading, setLoading] = useState(true),
        [copied, setCopied] = useState(false),
        [focused, setFocused] = useState(false);
    useEffect(() => {
        fetch('/api/screeps?endpoint=overview')
            .then(async (r) => {
                const d = await r.json();
                if (!r.ok || d.error) throw new Error(d.error || `エラー: ${r.status}`);
                return d;
            })
            .then((d) => {
                setStats(d);
                setLoading(false);
            })
            .catch((e) => {
                setError(e.message || String(e));
                setLoading(false);
            });
    }, []);
    const copyErr = () =>
        error &&
        navigator.clipboard.writeText(error).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });

    if (loading)
        return (
            <main aria-live="polite" style={{ padding: '2rem', fontFamily: 'monospace' }}>
                <h1 style={{ color: '#004b73', animation: 'pulse 2s infinite' }}>読み込み中...</h1>
                <div
                    style={{
                        height: '4px',
                        width: '100%',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '2px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: '30%',
                            backgroundColor: '#004b73',
                            animation: 'pulse 1.5s infinite ease-in-out',
                        }}
                    />
                </div>
            </main>
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
    const gclPercent = stats?.gcl?.progressTotal
        ? (stats.gcl.progress / stats.gcl.progressTotal) * 100
        : 0;

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#004b73' }}>🐛 Screeps ダッシュボード</h1>
            <div
                style={{
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                        🌐 GCL: {stats?.gcl?.level} ({gclPercent.toFixed(2)}%)
                    </p>
                    <div
                        role="progressbar"
                        aria-valuenow={Math.round(gclPercent)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label="GCL Progress"
                        style={{
                            height: '8px',
                            width: '100%',
                            backgroundColor: '#edf2f7',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                width: `${gclPercent}%`,
                                backgroundColor: '#00aaff',
                                transition: 'width 0.5s ease-out',
                            }}
                        />
                    </div>
                </div>
                <p>📊 CPU 使用率: {stats?.cpuUsed?.toFixed(2)}</p>
                <p>
                    🏘️ {stats?.rooms?.length === 1 ? '部屋' : '部屋数'}: {stats?.rooms?.length || 0}
                </p>
            </div>
            <details style={{ cursor: 'pointer' }}>
                <summary className="interactive-hint" style={{ color: '#4a5568' }}>
                    生データを確認
                </summary>
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
