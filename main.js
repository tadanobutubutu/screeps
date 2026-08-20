import React, { useState, useEffect } from 'react';

interface DashboardProps {
  // Add your props here if any
}

const Dashboard: React.FC<DashboardProps> = () => {
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [dependencyData, setDependencyData] = useState<any>(null);

  const fetchStats = async (forceRefresh = false) => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/stats' + (forceRefresh ? '?force=true' : ''));
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setRefreshing(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const response = await fetch('/api/dependencies');
      const data = await response.json();
      setDependencyData(data);
    } catch (err) {
      console.error('Failed to fetch dependencies:', err);
    }
  };

  const copyErr = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchDependencies();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
          title="再試行"
          style={{
            backgroundColor: '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '1rem',
            transition: 'all 0.2s ease-in-out',
            transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
            boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
            filter: errRetryHover ? 'brightness(1.1)' : 'none',
          }}
        >
          {refreshing ? '🔄 再試行中...' : '🔄 再試行'}
        </button>
      </div>
    );
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Dependency Dashboard</h1>
      
      {dependencyData?.awaitingSchedule?.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Awaiting Schedule</h2>
          <p>The following updates are awaiting their schedule. To get an update now, click on a checkbox below.</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {dependencyData.awaitingSchedule.map((item: any, index: number) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <label>
                  <input type="checkbox" /> {item}
                </label>
              </li>
            ))}
          </ul>
          {dependencyData.awaitingSchedule.length > 1 && (
            <button style={{
              backgroundColor: '#004b73',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}>
              🔐 Create all awaiting schedule PRs at once 🔐
            </button>
          )}
        </section>
      )}

      {dependencyData?.blockedPRs?.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>PR Closed (Blocked)</h2>
          <p>The following updates are blocked by an existing closed PR. To recreate the PR, click on a checkbox below.</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {dependencyData.blockedPRs.map((pr: any, index: number) => (
              <li key={index} style={{ marginBottom: '0.5rem' }}>
                <label>
                  <input type="checkbox" /> {pr}
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dependencyData?.dependencies && (
        <section>
          <h2>Detected Dependencies</h2>
          {Object.entries(dependencyData.dependencies).map(([type, items]: [string, any]) => (
            <details key={type} style={{ marginBottom: '1rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {type} ({items.length})
              </summary>
              <blockquote style={{ marginLeft: '1rem' }}>
                {items.map((item: any, index: number) => (
                  <div key={index} style={{ marginBottom: '0.5rem' }}>
                    {item.packages?.length > 0 && (
                      <details>
                        <summary>({item.packages.length})</summary>
                        <ul style={{ listStyle: 'none', padding: '0.5rem 0 0.5rem 1rem' }}>
                          {item.packages.map((pkg: string, pkgIndex: number) => {
                            const hasUpdate = pkg.includes('→');
                            const [current, update] = hasUpdate ? pkg.split('→') : [pkg, null];
                            return (
                              <li key={pkgIndex}>
                                {current}
                                {hasUpdate && (
                                  <span style={{ color: '#155d27' }}> → {update}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </details>
                    )}
                  </div>
                ))}
              </blockquote>
            </details>
          ))}
        </section>
      )}

      {stats && (
        <section style={{ marginTop: '2rem' }}>
          <h2>Statistics</h2>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {JSON.stringify(stats, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
};

export default Dashboard;

export { Dashboard };
export type { DashboardProps };