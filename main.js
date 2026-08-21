// Existing main.js content
// ...

// Add new functions or changes requested in the issue
// Example: If a new function is needed to handle the error state in Dashboard.tsx
function handleErrorMessage(error) {
    // Implementation for handling error message
    // ...
}

// Replace the duplicate <main> elements in Dashboard.tsx with <section> or <article>
// Assuming the original code structure, here's how you might refactor the component:

import React from 'react';

const Dashboard = ({ error, copied, errCopyHover, refreshing, fetchStats }) => {
    // Other component logic...
    const copyErr = () => {
        navigator.clipboard.writeText(error);
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
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                    }}
                >
                    🔄 再試行
                </button>
            </section>
        );
    }

    return (
        <main>
            {/* Main dashboard content */}
            <div style={{ padding: '2rem' }}>
                {/* Dashboard success state content */}
            </div>
        </main>
    );
};

export default Dashboard;

// ...