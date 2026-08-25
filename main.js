// TODO: Address accessibility issues from insight report

import React, { useState } from 'react';

/**
 * Stats component that displays either success or error state.
 * Uses <main> only for the primary content and <section> for error display
 * to avoid multiple landmarks violation (REACT_025).
 */
export default function Stats({ stats, error, fetchStats }) {
    const [refreshing, setRefreshing] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);
    const [copied, setCopied] = useState(false);

    if (error) {
        const copyErr = async () => {
            try {
                await navigator.clipboard.writeText(error);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        };

        return (
            <section
                style={{ padding: '2rem', fontFamily: 'monospace' }}
                aria-labelledby="error-heading"
            >
                <h1
                    id="error-heading"
                    style={{ color: '#b71c1c' }}
                >
                    ⚠️ エラー
                </h1>
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
                    style={{
                        marginLeft: '0.5rem',
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
            </section>
        );
    }

    return (
        <main style={{ padding: '2rem' }}>
            <h1>統計情報</h1>
            <div>{stats}</div>
        </main>
    );
}