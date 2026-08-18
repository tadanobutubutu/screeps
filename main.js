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

    const handleReload = () => {
        // This 'handleReload' method was introduced in the second version.
        // It's added here to ensure all functionality is preserved from both versions.
        window.location.reload();
    };

    if (hasError) {
        return (
            <section
                role="alert"
                aria-labelledby="error-heading"
                style={{ padding: '2rem', fontFamily: 'monospace' }}
            >
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
                    {error && error.toString()}
                    <br />
                    {errorInfo.componentStack}
                </pre>
                <button
                    onClick={handleReload}
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
                {FallbackComponent}
            </section>
        );
    }

    return (
        <div>
            <section>{children}</section>
        </div>
    );
};

export default ErrorBoundary;