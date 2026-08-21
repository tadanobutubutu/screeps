import React, { useState, useEffect } from 'react';

const Dashboard = ({ stats, error, fetchStats }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyErr = () => {
        ...
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (error) {
        return (
            <main aria-labelledby="error-heading">
                <section style={{ padding: '2rem', fontFamily: 'monospace' }} aria-labelledby="error-section-heading">
                    <h1 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
                    <h2 id="error-section-heading" className="sr-only">エラーの詳細</h2>
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
                        onMouseLeave={() => ...
                        onFocus={() => setErrCopyHover(true)}
                        onBlur={() => ...
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
                        {copied ? '✅' : '📋'} <span>{copied ? 'コピー済み' : 'エラーをコピー'}</span>
                    </button>
                    <button
                        onClick={() => fetchStats(true)}
                        disabled={refreshing}
                        onMouseEnter={() => setErrRetryHover(true)}
                        onMouseLeave={() => setErrRetryHover(false)}
                        aria-label="統計を再取得する"
                        style={{
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '1rem',
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        🔄 <span>再試行</span>
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main aria-labelledby="dashboard-heading">
            <section style={{ padding: '2rem' }} aria-labelledby="stats-section-heading">
                <h1 id="dashboard-heading" style={{ color: '#2b6cb0' }}>📊 ダッシュボード</h1>
                <h2 id="stats-section-heading" className="sr-only">統計情報</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    ... value]) => (
                        <div
                            key={key}
                            style={{
                                backgroundColor: '#f7fafc',
                                borderRadius: '8px',
                                padding: '1rem',
                                flex: '1 1 200px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                            role="region"
                            aria-label={`${key}の統計`}
                        >
                            <h2 style={{ marginTop: 0, color: '#2c5282' }}>{key}</h2>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2b6cb0' }}>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    aria-label="統計データをリフレッシュする"
                    style={{
                        backgroundColor: '#2b6cb0',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        transition: 'all 0.2s ease-in-out',
                    }}
                    onMouseEnter={() => setErrRetryHover(true)}
                    onMouseLeave={() => setErrRetryHover(false)}
                >
                    🔄 <span>データをリフレッシュ</span>
                </button>
            </section>
        </main>
    );
};

export default Dashboard;