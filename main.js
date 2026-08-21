import { useState } from 'react';
import Link from 'next/link';

export default function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // State for the component that handles error and stats UI
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  // Placeholder handlers (replace with actual logic as needed)
  const copyErr = () => {
    // Implement copy error to clipboard logic
    setCopied(true);
    // Reset after a short delay if desired
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchStats = (force) => {
    // Implement stats fetching logic
    setRefreshing(true);
    // Simulate async work
    setTimeout(() => {
      setRefreshing(false);
      // Update data if needed
    }, 1000);
  };

  const YourComponent = ({ error, data, onRetry }) => {
    return (
      <section aria-labelledby="error-title">
        {error ? (
          <>
            <h1
              id="error-title"
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
              // Additional props for the retry button can be added here
            >
              再試行
            </button>
          </>
        ) : (
          <>
            <section aria-labelledby="stats-title">
              {/* Success state content */}
            </section>
          </>
        )}
      </section>
    );
  };

  return (
    <div lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <button
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <title>Menu icon</title>
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main role="main">
        <YourComponent error={error} data={data} onRetry={onRetry} />
      </main>

      <aside role="complementary" aria-label="Sidebar navigation">
        <button
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <title>Sidebar toggle icon</title>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {sidebarOpen && (
          <nav aria-label="Sidebar navigation">
            <ul>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/settings">Settings</Link></li>
            </ul>
          </nav>
        )}

        <div className="info">
          <span>Sidebar</span>
          <button
            aria-label="Go to home"
            onClick={() => {}}
          >
            Go home
          </button>
        </div>
      </aside>

      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </div>
  );
}