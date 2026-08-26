// main.js - Wrapping content in a single <main> landmark to fix REACT_025

export const ErrorDisplay = ({ error, copyErr, copied, errCopyHover, setErrCopyHover, errRetryHover, setErrRetryHover, fetchStats, refreshing }) => {
    return (
        <main role="main" aria-label="エラーディスプレイ">
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
                    }}
                >
                    再試行
                </button>
            </div>
        </main>
    );
};

export const SuccessDisplay = ({ stats }) => {
    return (
        <main role="main" aria-label="統計情報">
            <article style={{ padding: '2rem' }}>
                <h1>統計情報</h1>
                <section aria-label="サマリー">
                    {/* Stats content */}
                </section>
            </article>
        </main>
    );
};

// Main component that uses a single <main> landmark with conditional content
export const StatsPage = ({ hasError, errorProps, statsProps }) => {
    if (hasError) {
        return <ErrorDisplay {...errorProps} />;
    }
    
    return <SuccessDisplay {...statsProps} />;
};

export default StatsPage;