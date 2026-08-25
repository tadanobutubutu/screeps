import React, { useState, useEffect } from 'react';

export function Stats({ fetchStats }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [successCopyHover, setSuccessCopyHover] = useState(false);
    const [successRetryHover, setSuccessRetryHover] = useState(false);

    const loadStats = async (force = false) => {
        if (!force && data) return;
        try {
            setRefreshing(force);
            const res = await fetch('/api/stats');
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            setData(await res.json());
            setError(null);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { loadStats(); }, []);

    const copyErr = () => {
        navigator.clipboard.writeText(error).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const copyStats = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {error ? (
                <section aria-labelledby="error-heading">
                    <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
                        onClick={() => loadStats(true)}
                        disabled={refreshing}
                        onMouseEnter={() => setErrRetryHover(true)}
                        onMouseLeave={() => setErrRetryHover(false)}
                        onFocus={() => setErrRetryHover(true)}
                        onBlur={() => setErrRetryHover(false)}
                        style={{
                            marginLeft: '0.5rem',
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                            filter: errRetryHover ? 'brightness(1.1)' : 'none',
                        }}
                    >
                        🔄 リトライ
                    </button>
                </section>
            ) : loading ? (
                <p>読み込み中...</p>
            ) : (
                <section aria-labelledby="stats-heading">
                    <h1 id="stats-heading" style={{ color: '#1a1a1a' }}>📊 統計情報</h1>
                    <pre
                        tabIndex={0}
                        aria-label="統計詳細"
                        style={{
                            color: '#2d3748',
                            backgroundColor: '#f7fafc',
                            padding: '1rem',
                            borderRadius: '4px',
                            overflow: 'auto',
                        }}
                    >
                        {JSON.stringify(data, null, 2)}
                    </pre>
                    <button
                        onClick={copyStats}
                        onMouseEnter={() => setSuccessCopyHover(true)}
                        onMouseLeave={() => setSuccessCopyHover(false)}
                        onFocus={() => setSuccessCopyHover(true)}
                        onBlur={() => setSuccessCopyHover(false)}
                        aria-label={copied ? 'コピー済み' : '統計をコピー'}
                        title={copied ? 'コピー済み' : '統計をコピー'}
                        style={{
                            backgroundColor: copied ? '#155d27' : '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            transform: successCopyHover ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: successCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                            filter: successCopyHover ? 'brightness(1.1)' : 'none',
                        }}
                    >
                        {copied ? '✅ コピー済み' : '📋 統計をコピー'}
                    </button>
                    <button
                        onClick={() => loadStats(true)}
                        disabled={refreshing}
                        onMouseEnter={() => setSuccessRetryHover(true)}
                        onMouseLeave={() => setSuccessRetryHover(false)}
                        onFocus={() => setSuccessRetryHover(true)}
                        onBlur={() => setSuccessRetryHover(false)}
                        style={{
                            marginLeft: '0.5rem',
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            transform: successRetryHover ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: successRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                            filter: successRetryHover ? 'brightness(1.1)' : 'none',
                        }}
                    >
                        🔄 更新
                    </button>
                </section>
            )}
        </main>
    );
}