import React, { useState, useEffect } from 'react';
import { useStats } from '../hooks/useStats';

export const Dashboard = () => {
    const { stats, error, fetchStats, refreshing } = useStats();
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (error) {
        return (
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
                    title="再試行"
                    style={{
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
                        marginLeft: '1rem',
                    }}
                >
                    {refreshing ? '🔄 再試行中...' : '🔄 再試行'}
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1 style={{ color: '#004b73' }}>📊 ダッシュボード</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {Object.entries(stats).map(([key, value]) => (
                    <div
                        key={key}
                        style={{
                            backgroundColor: '#f7fafc',
                            borderRadius: '4px',
                            padding: '1rem',
                            flex: '1 1 200px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <h2 style={{ marginTop: 0, color: '#2d3748' }}>{key}</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2b6cb0' }}>
                            {value}
                        </p>
                    </div>
                ))}
            </div>
            <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                onMouseEnter={() => setErrRetryHover(true)}
                onMouseLeave={() => setErrRetryHover(false)}
                aria-label="更新"
                title="更新"
                style={{
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
                    marginTop: '1rem',
                }}
            >
                {refreshing ? '🔄 更新中...' : '🔄 更新'}
            </button>
        </div>
    );
};