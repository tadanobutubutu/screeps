// main.js - Helper utilities for accessibility fixes

/**
 * Checks if the given JSX/TSX content has a <main> landmark
 * @param {string} content - File content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(content) {
  const mainRegex = /<main[\s>]/gi;
  return mainRegex.test(content);
}

/**
 * Wraps children in a <main> landmark
 * @param {string} content - File content to modify
 * @param {string} childrenTag - The tag containing main children (e.g., 'body', 'div')
 * @returns {string} - Modified content with <main> landmark
 */
function addMainLandmark(content, childrenTag = 'children') {
  // Pattern to find <body>{children}</body> or <div>{children}</div>
  const bodyPattern = /<(\w+)>\s*\{(\w+)\}\s*<\/\1>/g;
  
  return content.replace(bodyPattern, (match, tag, children) => {
    if (tag === 'body' || tag === 'div' || tag === 'section') {
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
}

/**
 * Escapes HTML entities in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  addMainLandmark,
  escapeHtml
};

import React, { useState, useEffect } from 'react';

interface DashboardProps {
    // Add any props your component needs
}

const Dashboard: React.FC<DashboardProps> = () => {
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errCopyHover, setErrCopyHover] = useState(false);
    const [errRetryHover, setErrRetryHover] = useState(false);

    const fetchStats = async (forceRefresh = false) => {
        // Your existing fetchStats implementation
    };

    const copyErr = () => {
        // Your existing copyErr implementation
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
                    aria-label="再試行"
                    title="再試行"
                    style={{
                        backgroundColor: '#004b73',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
                        filter: errRetryHover ? 'brightness(1.1)' : 'none',
                        marginLeft: '0.5rem',
                    }}
                >
                    {refreshing ? '🔄 再試行中...' : '🔄 再試行'}
                </button>
            </div>
        );
    }

    // Success state content wrapped in a single main element
    return (
        <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {/* Your existing success state content */}
            <h1>Dashboard</h1>
            {/* Add your dashboard content here */}
        </main>
    );
};

export default Dashboard;