import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Existing component (preserved as-is)
export function ExistingComponent({ title, description }) {
  return (
    <div className="existing-component">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

ExistingComponent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

// New component with accessibility fixes
export function AccessibleTable({ data, caption }) {
  return (
    <div className="accessible-table-container">
      <table aria-label={caption}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} scope="col">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

AccessibleTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  caption: PropTypes.string.isRequired,
};

// New component for landmarks
export function AccessibleLandmark({ type, children }) {
  const landmarkMap = {
    main: 'main',
    navigation: 'nav',
    search: 'section',
    contentinfo: 'footer',
  };

  const Tag = landmarkMap[type] || 'section';

  return (
    <Tag aria-label={type === 'search' ? 'Search' : undefined}>
      {children}
    </Tag>
  );
}

AccessibleLandmark.propTypes = {
  type: PropTypes.oneOf(['main', 'navigation', 'search', 'contentinfo']).isRequired,
  children: PropTypes.node.isRequired,
};

// New component for accessible SVG
export function AccessibleSVG({ title, description, children }) {
  return (
    <svg role="img" aria-label={`${title}: ${description}`}>
      <title>{title}</title>
      <desc>{description}</desc>
      {children}
    </svg>
  );
}

AccessibleSVG.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// New component for fake links
export function AccessibleButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="accessible-button"
    >
      {children}
    </button>
  );
}

AccessibleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

// Language attribute fix
export function LanguageWrapper({ lang, children }) {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
}

LanguageWrapper.propTypes = {
  lang: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Dashboard component (integrated from other branch)
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);

    const fetchStats = async (force = false) => {
        if (refreshing && !force) return;
        setRefreshing(true);
        try {
            const response = await fetch('/api/stats');
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            setStats(null);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                    🔄 再試行
                </button>
            </div>
        );
    }

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {Object.entries(stats).map(([key, value]) => (
                    <div key={key} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                        <h3>{key}</h3>
                        <p>{value}</p>
                    </div>
                ))}
            </div>
            <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#004b73',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
        </div>
    );
};

export default Dashboard;