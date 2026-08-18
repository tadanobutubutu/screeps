import React, { Component } from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            error: null, 
            errorInfo: null, 
            hasError: false 
        };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
            hasError: true
        });
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
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
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
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

        return <main>{this.props.children}</main>;
    }
}

hydrateRoot(
    document.documentElement.setAttribute('lang', 'en'),
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
);