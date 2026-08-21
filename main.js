import { useState } from 'react';

export default function StatsComponent() {
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fetchStats = async (force = false) => {
        setLoading(true);
        setRefreshing(true);
        try {
            const response = await fetch('/api/stats');
            const result = await response.json();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useState(() => {
        fetchStats();
    }, []);

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
                        aria-label="再試行"
                        style={{
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '0.5rem',
                        }}
                    >
                        {refreshing ? '更新中...' : '🔄 再試行'}
                    </button>
                </div>
            </main>
        );
    }

    if (loading && !data) {
        return (
            <main>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <p>読み込み中...</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <section aria-label="統計データ">
                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1>統計</h1>
                        <button
                            onClick={() => fetchStats(true)}
                            disabled={refreshing}
                            aria-label="統計を更新"
                            style={{
                                backgroundColor: '#004b73',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            {refreshing ? '更新中...' : '🔄 更新'}
                        </button>
                    </div>
                    {data && (
                        <div style={{ marginTop: '1rem' }}>
                            <p>総数: {data.total}</p>
                            <p>アクティブ: {data.active}</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}