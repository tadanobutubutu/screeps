// main.js

// Preserve all existing code and exports from current main.js
// Add new functions or changes requested in the issue

// Example of existing code that should be preserved
// function existingFunction() { ... }
// export { existingFunction };

// New code for dependency updates
// Update ESLint to v10
const eslint = require('eslint').ESLint;
const eslintConfig = {
  // Updated ESLint configuration for v10
  // ... existing config ...
};

// Update Jest to v30
const jest = require('jest');
const jestConfig = {
  // Updated Jest configuration for v30
  // ... existing config ...
};

// Update TypeScript to v7
const typescript = require('typescript');
const tsConfig = {
  // Updated TypeScript configuration for v7
  // ... existing config ...
};

// Update React to v19
const react = require('react');
const reactDom = require('react-dom');

// Preserve all existing exports
// export { existingFunction };

// Add new exports if needed
export { eslintConfig, jestConfig, tsConfig };

// Import and modify the Dashboard component
import React, { useState, useEffect } from 'react';

const Dashboard = ({ stats, error, refreshing, fetchStats }) => {
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    navigator.clipboard.writeText(error);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error) {
    // Add main landmark for React accessibility
    return (
      <MainLandmark>
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
              marginLeft: '1rem'
            }}
          >
            {refreshing ? '🔄 再试行中...' : '🔄 再试行'}
          </button>
        </div>
      </MainLandmark>
    );
  }

  // Add main landmark for static HTML files without React
  const addMainLandmarkToHTML = (htmlContent) => {
    if (htmlContent.includes('<main>')) return htmlContent;

    const bodyStart = htmlContent.indexOf('<body>');
    if (bodyStart === -1) return htmlContent;

    const bodyEnd = htmlContent.indexOf('</body>', bodyStart);
    if (bodyEnd === -1) return htmlContent;

    const contentBefore = htmlContent.substring(0, bodyStart + 6);
    const contentAfter = htmlContent.substring(bodyEnd);

    return `${contentBefore}<main>${htmlContent.substring(bodyStart + 6, bodyEnd)}</main>${contentAfter}`;
  };

  // Export the additional function (this was added after the HTML function)
  export { addMainLandmarkToHTML };

  // Rest of the existing Dashboard code
  ...

  // Export the updated Dashboard component and the new functions
  export default Dashboard;
  export { makeSvgAccessible, ConditionalMainLandmark };