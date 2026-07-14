'use client';
import { useEffect, useState, useCallback } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null),
        [error, setError] = useState<string | null>(null),
        [loading, setLoading] = useState(true),
        [refreshing, setRefreshing] = useState(false),
        [lastUpdated, setLastUpdated] = useState<Date | null>(null),
        [copied, setCopied] = useState(false),
        [copiedRoom, setCopiedRoom] = useState<string | null>(null);

    const fetchStats = useCallback(async (isManual = false) => {
        if (isManual) setRefreshing(true);
        try {
            const r = await fetch('/api/screeps?endpoint=overview');
            const d = await r.json();
            if (!r.ok || d.error) throw new Error(d.error || `エラー: ${r.status}`);
            setStats(d);
            setLastUpdated(new Date());
            setError(null);
        } catch (e: any) {
            setError(e.message || String(e));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only trigger if no input/textarea is focused and Alt+R is pressed
            // Using Alt+R to comply with WCAG 2.1.4 (avoiding single-key shortcuts)
            if (
                e.altKey &&
                e.key.toLowerCase() === 'r' &&
                !refreshing &&
                !(
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    (e.target as HTMLElement).isContentEditable
                )
            ) {
                e.preventDefault();
                fetchStats(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [fetchStats, refreshing]);

    const copyErr = () =>
        error &&
        navigator.clipboard.writeText(error).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });

    const copyRoom = (room: string) => {
        navigator.clipboard.writeText(room).then(() => {
            setCopiedRoom(room);
            setTimeout(() => setCopiedRoom(null), 2000);
        });
    };

    if (loading)
        return (
            <p
                aria-live="polite"
                style={{
                    padding: '2rem',
                    fontFamily: 'monospace',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
            >
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
                    aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
                    style={{
                        backgroundColor: copied ? '#155d27' : '#004b73',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                >
                    {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
                </button>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    aria-label="データを再読み込み"
                    title="データを再読み込み"
                    style={{
                        marginLeft: '1rem',
                        padding: '0.5rem 1rem',
                        cursor: refreshing ? 'not-allowed' : 'pointer',
                        backgroundColor: refreshing ? '#edf2f7' : '#f7fafc',
                        color: refreshing ? '#a0aec0' : 'inherit',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                    }}
                >
                    {refreshing ? '読み込み中...' : '🔄 再試行'}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {lastUpdated && (
                        <span
                            className="interactive-hint"
                            tabIndex={0}
                            title="最後にデータが更新された時間です"
                            style={{ fontSize: '0.8rem', color: '#718096' }}
                        >
                            🕒 {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <kbd
                            title="Alt + R キーで更新できます"
                            style={{
                                backgroundColor: '#f7fafc',
                                border: '1px solid #cbd5e0',
                                borderRadius: '4px',
                                padding: '0.1rem 0.4rem',
                                fontSize: '0.7rem',
                                color: '#4a5568',
                                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                                cursor: 'help',
                            }}
                        >
                            Alt + R
                        </kbd>
                        <button
                            onClick={() => fetchStats(true)}
                            disabled={refreshing}
                            aria-label="更新 (Alt + R)"
                            title="データを更新 (Alt + R)"
                            style={{
                                padding: '0.5rem',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: refreshing ? '#edf2f7' : '#004b73',
                                color: refreshing ? '#a0aec0' : 'white',
                                cursor: refreshing ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
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
                </div>
            </div>
            <div
                style={{
                    marginBottom: '1rem',
                    border: '1px solid #e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '0.25rem',
                        }}
                    >
                        <span>🌐 GCL: {stats?.gcl?.level}</span>
                        <span>
                            {stats?.gcl?.progressTotal
                                ? ((stats.gcl.progress / stats.gcl.progressTotal) * 100).toFixed(2)
                                : '0.00'}
                            %
                        </span>
                    </div>
                    <div
                        role="progressbar"
                        aria-label="GCL Progress"
                        aria-valuenow={stats?.gcl?.progress || 0}
                        aria-valuemin={0}
                        aria-valuemax={stats?.gcl?.progressTotal || 100}
                        style={{
                            height: '0.5rem',
                            backgroundColor: '#edf2f7',
                            borderRadius: '4px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                height: '100%',
                                backgroundColor: '#004b73',
                                width: `${
                                    stats?.gcl?.progressTotal
                                        ? (stats.gcl.progress / stats.gcl.progressTotal) * 100
                                        : 0
                                }%`,
                                transition: 'width 0.3s ease-in-out',
                            }}
                        />
                    </div>
                </div>
                <p
                    className="interactive-hint"
                    title="現在のサーバー時間における AI の CPU 使用量です"
                    tabIndex={0}
                >
                    📊 CPU 使用率: {stats?.cpuUsed?.toFixed(2)}
                </p>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <span
                        className="interactive-hint"
                        tabIndex={0}
                        title="AI が現在活動している部屋のリストです"
                    >
                        🏘️ {stats?.rooms?.length === 1 ? '部屋' : '部屋数'}:
                    </span>
                    {stats?.rooms?.length > 0 ? (
                        stats.rooms.map((room: string) => (
                            <button
                                key={room}
                                onClick={() => copyRoom(room)}
                                aria-label={`部屋名 ${room} をコピー`}
                                title={`部屋名 ${room} をコピー`}
                                style={{
                                    fontSize: '0.75rem',
                                    backgroundColor: copiedRoom === room ? '#c6f6d5' : '#edf2f7',
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '4px',
                                    border: '1px solid #cbd5e0',
                                    color: copiedRoom === room ? '#22543d' : '#2d3748',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {copiedRoom === room ? `✅ ${room}` : room}
                            </button>
                        ))
                    ) : (
                        <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>なし</span>
                    )}
                </div>
            </div>
            <details style={{ cursor: 'pointer' }}>
                <summary
                    className="interactive-hint"
                    title="生データを JSON 形式で表示/非表示にします"
                    style={{ color: '#4a5568' }}
                >
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
