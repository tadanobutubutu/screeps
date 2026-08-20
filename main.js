export function wrapWithMain(content) {
  return <main aria-label="Main content">{content}</main>;
}

export function createMainContent(content) {
  return React.createElement('main', { 'aria-label': 'Main content' }, content);
}

export function updateLayoutWithMain(children) {
  return (
    <html lang="ja">
      <head>
        {/* Head content */}
      </head>
      <body>
        <main aria-label="Main content">{children}</main>
      </body>
    </html>
  );
}

export function updateDocsContent(content) {
  return (
    <main aria-label="Documentation content">
      <div className="container">
        {content}
      </div>
    </main>
  );
}

export function createAccessibleSvg({ children, isDecorative = false }) {
  if (isDecorative) {
    return <svg aria-hidden="true">{children}</svg>;
  }
  return (
    <svg aria-label="Favicon">
      <title>Favicon</title>
      {children}
    </svg>
  );
}

export function renderConditionalMain({ error, content, errorContent }) {
  if (error) {
    return (
      <section aria-label="Error state">
        {errorContent}
      </section>
    );
  }
  return (
    <main aria-label="Main content">
      {content}
    </main>
  );
}

export function createErrorSection({ error, copyErr, setErrCopyHover, errCopyHover, copied, refreshing, fetchStats, setErrRetryHover }) {
  return (
    <section aria-label="Error state" style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
          backgroundColor: '#2b6cb0',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '0.5rem',
        }}
      >
        再試行
      </button>
    </section>
  );
}