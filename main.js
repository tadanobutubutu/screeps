// Insight Code: REACT_025 fix - Using <section> for error state instead of <main>

import React from 'react';

// ... existing imports and code ...

// Helper component for error state display
const ErrorDisplay = ({ error, onCopy, copied, errCopyHover }) => {
    return (
        <section 
            aria-labelledby="error-title"
            style={{ padding: '2rem', fontFamily: 'monospace' }}
        >
            <h1 id="error-title" style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
                onClick={onCopy}
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
            >
                再試行
            </button>
        </section>
    );
};

// Main component return
// If error, render section (not main) - fixes REACT_025
// If success, render main with unique landmark