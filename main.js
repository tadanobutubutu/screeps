import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// ErrorBoundary component
const ErrorBoundary = ({ children, fallback: FallbackComponent }) => {
    const [error, setError] = React.useState(null);
    const [errorInfo, setErrorInfo] = React.useState(null);
    const [hasError, setHasError] = React.useState(false);

    const componentDidCatch = (error, errorInfo) => {
        setError(error);
        setErrorInfo(errorInfo);
        setHasError(true);
    };

    if (hasError) {
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
                    {error && error.toString()}
                    <br />
                    {errorInfo.componentStack}
                </pre>
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

    return <main>{children}</main>;
};

hydrateRoot(
  document.getElementById('root'),
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);