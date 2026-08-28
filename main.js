// Current main.js - Fixed REACT_025: React Unique Landmarks issue
// Changed multiple <main> elements to single <main> with <section> for internal content

export default function StatsDisplay({ stats, error, onRefresh }) {
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (error) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
            onClick={() => onRefresh?.()}
            style={{ marginLeft: '0.5rem' }}
            aria-label="再試行"
          >
            🔄 再試行
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <section aria-labelledby="stats-heading">
        <h1 id="stats-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📊 統計情報</h1>
        {stats && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>総タスク数: {stats.totalTasks}</div>
            <div>完了: {stats.completedTasks}</div>
            <div>進行中: {stats.inProgressTasks}</div>
          </div>
        )}
      </section>
    </main>
  );
}