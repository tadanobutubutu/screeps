// ErrorBoundary.jsx
import React, { useState } from 'react';

const ErrorBoundary = ({ children, fallback: FallbackComponent }) => {
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);
    const [hasError, setHasError] = useState(false);

    const componentDidCatch = (error, errorInfo) => {
        setError(error);
        setErrorInfo(errorInfo);
        setHasError(true);
    };

    if (hasError) {
        return (
            <section
                lang="ja"
                aria-labelledby="error-heading"
                style={{ padding: '2rem', fontFamily: 'monospace' }}
            >
                <h1
                    id="error-heading"
                    style={{ color: '#b71c1c' }}
                >
                    ⚠️ エラー
                </h1>
                <div
                    role="alert"
                    aria-live="assertive"
                    style={{
                        color: '#c53030',
                        backgroundColor: '#fff5f5',
                        padding: '1rem',
                        borderRadius: '4px',
                        overflow: 'auto',
                    }}
                >
                    <pre
                        tabIndex={0}
                        aria-label="エラーメッセージ詳細"
                    >
                        {error && error.toString()}
                        <br />
                        {errorInfo.componentStack}
                    </pre>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        backgroundColor: '#004b73',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    🔄 ページを再読み込み
                </button>
            </section>
        );
    }

    return <main lang="ja">{children}</main>;
};

export default ErrorBoundary;