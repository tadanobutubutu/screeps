// main.js - Accessibility Fixed Version

export function MainContent({ children, className = '' }) {
  return (
    <main
      className={className}
      id="main-content"
    >
      {children}
    </main>
  );
}

export function Navigation({ items = [], ariaLabel = 'Main navigation' }) {
  return (
    <nav aria-label={ariaLabel}>
      <ul role="list">
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href} aria-current={item.isActive ? 'page' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AccessibleTable({ headers = [], rows = [], caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AccessibleIcon({ icon: Icon, label, className = '' }) {
  return (
    <span className={className} aria-hidden="false">
      <Icon
        aria-label={label}
        role="img"
      />
    </span>
  );
}

export function AccessibleButton({
  children,
  onClick,
  variant = 'primary',
  ariaLabel,
  disabled = false,
  type = 'button'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

export function AccessibleLink({
  children,
  href,
  ariaLabel,
  className = ''
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}

export function ErrorDisplay({ error, copyErr, copied, refreshing, fetchStats }) {
  const [errCopyHover, setErrCopyHover] = React.useState(false);
  const [errRetryHover, setErrRetryHover] = React.useState(false);

  return (
    <section aria-labelledby="error-heading">
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
          backgroundColor: '#38a169',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '0.5rem',
          transition: 'all 0.2s ease-in-out',
          transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
          boxShadow: errRetryHover ? '0 4px 10px rgba(56, 161, 105, 0.3)' : 'none',
          filter: errRetryHover ? 'brightness(1.1)' : 'none',
        }}
      >
        再試行
      </button>
    </section>
  );
}

export function PageLayout({
  children,
  sidebar,
  navigation
}) {
  return (
    <div lang="en">
      <header>
        {navigation}
      </header>

      <div className="layout-container">
        <aside aria-label="Secondary content">
          {sidebar}
        </aside>

        <MainContent>
          {children}
        </MainContent>
      </div>

      <footer>
        <p>Footer content</p>
      </footer>
    </div>
  );
}

export default {
  MainContent,
  Navigation,
  AccessibleTable,
  AccessibleIcon,
  AccessibleButton,
  AccessibleLink,
  ErrorDisplay,
  PageLayout
};