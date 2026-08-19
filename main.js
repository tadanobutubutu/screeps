import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Add lang attribute to the root element for better screen reader support
document.documentElement.lang = 'en';

// Add ARIA landmark roles if they're missing in the App component
// This would typically be handled in the App component itself, but we'll add it here as a fallback
if (!document.querySelector('[role="main"]')) {
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
  }
}

// Add focus management for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    background: #000;
    color: #fff;
    padding: 0.5rem;
    z-index: 100;
  `;
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);

  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.id = 'main-content';
  }

  // Fix for REACT_036: replace fake link with button
  const link = document.getElementById('unrotate');
  if (link && link.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.addEventListener('click', function() {
      // rotate back functionality
      if (window.rotateBack) {
        window.rotateBack();
      }
    });
    link.replaceWith(button);
  }
});

// Dashboard component from origin/main
import React, { useState, useEffect } from 'react';

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

    const copyErr = () => {
        navigator.clipboard.writeText(error);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        fetchStats();
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
                    style={{
                        backgroundColor: '#2b6cb0',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginLeft: '1rem',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: errRetryHover ? '0 4px 10px rgba(43, 108, 176, 0.3)' : 'none',
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
                    <div key={key} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
                        <h3 style={{ marginTop: 0 }}>{key}</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</p>
                    </div>
                ))}
            </div>
            <button
                onClick={() => fetchStats(true)}
                disabled={refreshing}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#2b6cb0',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                {refreshing ? '更新中...' : '更新'}
            </button>
        </div>
    );
};

export default Dashboard;