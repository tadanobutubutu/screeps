import React from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps Dashboard',
};

const handleUnrotate = () => {
  const image = document.querySelector('.rotatable-image')
  if (image) {
    image.style.transform = 'rotate(0deg)'
  }
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            error: null, 
            errorInfo: null, 
            hasError: false 
        }
        this.handleReload = this.handleReload.bind(this)
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
    }

    componentDidMount() {
        const unrotateBtn = document.getElementById('unrotate')
        if (unrotateBtn) {
            unrotateBtn.addEventListener('click', handleUnrotate)
        }
    }

    componentWillUnmount() {
        const unrotateBtn = document.getElementById('unrotate')
        if (unrotateBtn) {
            unrotateBtn.removeEventListener('click', handleUnrotate)
        }
    }

    handleReload() {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
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
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </pre>
                    <button
                        onClick={this.handleReload}
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
                    {this.props.fallback}
                </section>
            )
        }

        return (
            <div>
                <section>{this.props.children}</section>
            </div>
        )
    }
}

export { ErrorBoundary, handleUnrotate }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        >
          <title>Favicon</title>
        </svg>
        {children}
      </body>
    </html>
  );
}