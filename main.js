import React, { useState, useEffect } from 'react';

export default function App({ initialState }) {
    const [data, setData] = useState(initialState);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [sucCopyHover, setSucCopyHover] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = (bypassCache) => {
        setRefreshing(true);
        const params = new URLSearchParams({ bypassCache: bypassCache ? '1' : '0' });
        fetch(`api-endpoint-here?${params}`)
            .then((res) => {
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                return res.json();
            })
            .then((d) => {
                setData(d);
                setError(null);
                setRefreshing(false);
            })
            .catch((err) => {
                setError(err.message);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        if (initialState) return;
        fetchStats(false);
    }, []);

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (error) {
        return (
            <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
                    aria-label="再試行"
                    title="再試行"
                    style={{
                        backgroundColor: errRetryHover ? '#004b73' : '#6b7280',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '0.5rem',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                        filter: errRetryHover ? 'brightness(1.1)' : 'none',
                    }}
                >
                    {refreshing ? '🔄 更新中...' : '🔄 再試行'}
                </button>
            </section>
        );
    }

    const copySuccess = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#1a1a1a', marginBottom: '1rem' }}>📊  статистика</h1>
            <pre
                tabIndex={0}
                aria-label=" statistiques"
                style={{
                    backgroundColor: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '500px',
                }}
            >
                {JSON.stringify(data, null, 2)}
            </pre>
            <button
                onClick={copySuccess}
                onMouseEnter={() => setSucCopyHover(true)}
                onMouseLeave={() => setSucCopyHover(false)}
                onFocus={() => setSucCopyHover(true)}
                onBlur={() => setSucCopyHover(false)}
                aria-label={copied ? 'コピー済み' : 'クリップボードにコピー'}
                title={copied ? 'コピー済み' : 'クリップボードにコピー'}
                style={{
                    backgroundColor: copied ? '#155d27' : '#004b73',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    transition: 'all 0.2s ease-in-out',
                    transform: sucCopyHover ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: sucCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                    filter: sucCopyHover ? 'brightness(1.1)' : 'none',
                }}
            >
                {copied ? '✅ コピー済み' : '📋 コピー'}
            </button>
            <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                aria-label="数据进行缓存刷新"
                title="数据进行缓存刷新"
                style={{
                    backgroundColor: refreshing ? '#6b7280' : '#004b73',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    marginLeft: '0.5rem',
                }}
            >
                {refreshing ? '🔄 更新中...' : '🔄 更新'}
            </button>
        </main>
    );
}