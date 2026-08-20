// main.js
// [Preserve all existing code and exports]

// Add new dependency updates as needed
// For example, if updating Jest to v30:
const jest = require('jest'); // Update to v30 if needed

// For React updates:
import React, { useState, useEffect } from 'react'; // Update to v19 if needed

// For ESLint updates:
const eslint = require('eslint'); // Update to v10 if needed

// For TypeScript updates:
const typescript = require('typescript'); // Update to v7 if needed

// Add any new functions or changes requested in the issue
// while preserving all existing functionality

// Add main landmark to layout components
function wrapWithMain(content) {
  return React.createElement('main', { role: 'main', 'aria-label': 'Main content' }, content);
}

// Add main landmark to HTML documents
function addMainToHTML(content) {
  return `<main role="main" aria-label="Main content">${content}</main>`;
}

// Add language attribute to HTML documents
function addLanguageAttribute(html) {
  return html.replace(/<html([^>]*)>/, '<html$1 lang="en">');
}

// Add proper table structure
function createAccessibleTable(headers, rows) {
  return React.createElement(
    'table',
    { 'aria-label': 'Data table' },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        headers.map(header => React.createElement('th', { key: header, scope: 'col' }, header))
      )
    ),
    React.createElement(
      'tbody',
      null,
      rows.map((row, rowIndex) =>
        React.createElement(
          'tr',
          { key: rowIndex },
          row.map((cell, cellIndex) =>
            React.createElement('td', { key: cellIndex }, cell)
          )
        )
      )
    )
  );
}

// Add proper landmark structure
function createLandmarkStructure(content) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('header', { role: 'banner', 'aria-label': 'Site header' }, 'Header Content'),
    React.createElement('nav', { role: 'navigation', 'aria-label': 'Main navigation' }, 'Navigation Content'),
    React.createElement('main', { role: 'main', 'aria-label': 'Main content' }, content),
    React.createElement('footer', { role: 'contentinfo', 'aria-label': 'Site footer' }, 'Footer Content')
  );
}

// Add accessible SVG
function createAccessibleSVG(title, description, children) {
  return React.createElement(
    'svg',
    { role: 'img', 'aria-label': title, focusable: 'false' },
    React.createElement('title', null, title),
    React.createElement('desc', null, description),
    children
  );
}

// Add accessible link
function createAccessibleLink(href, text) {
  return React.createElement(
    'a',
    { href: href, 'aria-label': text },
    text
  );
}

// Add accessible form elements
function createAccessibleForm(label, id, type = 'text') {
  return React.createElement(
    'div',
    { className: 'form-group' },
    React.createElement('label', { htmlFor: id }, label),
    React.createElement('input', {
      type: type,
      id: id,
      'aria-required': type === 'text' ? 'false' : 'true',
      'aria-label': label
    })
  );
}

// Add accessible button
function createAccessibleButton(text, onClick, type = 'button') {
  return React.createElement(
    'button',
    {
      type: type,
      onClick: onClick,
      'aria-label': text
    },
    text
  );
}

// Add skip to content link
function createSkipToContentLink() {
  return React.createElement(
    'a',
    {
      href: '#main',
      className: 'skip-link',
      'aria-label': 'Skip to main content'
    },
    'Skip to main content'
  );
}

// Export the new functions for use in other files
const Dashboard = () => {
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
            <div role="main" style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
                        marginLeft: '1rem',
                        transition: 'all 0.2s ease-in-out',
                        transform: errRetryHover ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: errRetryHover ? '0 4px 10px rgba(43, 108, 176, 0.3)' : 'none',
                        filter: errRetryHover ? 'brightness(1.1)' : 'none',
                    }}
                >
                    {refreshing ? '再試行中...' : '🔄 再試行'}
                </button>
            </div>
        );
    }

    // Your existing success state rendering
    return (
        <div role="main" style={{ padding: '2rem' }}>
            {/* Your existing success state content */}
        </div>
    );
};

module.exports = {
  wrapWithMain,
  addMainToHTML,
  addLanguageAttribute,
  createAccessibleTable,
  createLandmarkStructure,
  createAccessibleSVG,
  createAccessibleLink,
  createAccessibleForm,
  createAccessibleButton,
  createSkipToContentLink,
  Dashboard,
  // Preserve all existing exports
  jest,
  React,
  eslint,
  typescript
};