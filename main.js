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
            <main>
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
            </main>
        );
    }

    return (
        <main>
            <section>{children}</section>
        </main>
    );
};

// Update the existing HTML content to use a <button> instead of an <a> tag
const DocsDependencyGraph = () => {
    return (
        <div>
            {/* ... other components ... */}
            <button id="unrotate" onClick={() => window.location.hash = ''}>rotate back</button>
            {/* ... other components ... */}
        </div>
    );
};

// Add accessibility attributes to SVG elements in layout files
const FaviconSVG = () => (
    <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="24"
        height="24"
    >
        <title>Favicon</title>
        {/* SVG content would go here */}
    </svg>
);

// Add the HTML document with lang attribute
const DependencyGraphHTML = () => {
    return (
        <html lang="en">
            <head>
                <title>Dependency Graph</title>
            </head>
            <body>
                <DocsDependencyGraph />
            </body>
        </html>
    );
};

export default ErrorBoundary;
export { DocsDependencyGraph, FaviconSVG, DependencyGraphHTML };