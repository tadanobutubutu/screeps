tsx
import React, { useState } from 'react';

// ...other imports go here...

const Dashboard = () => {
  // ...other components, state, and functions go here...

  // Move the first <main> element from the error state return path to the Dashboard component
  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {showError ? (
        <>
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
              // ... styles ...
            }}
          >
            {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
          </button>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            onMouseEnter={() => setErrRetryHover(true)}
            onMouseLeave={() => setErrRetryHover(false)}
            // ... delete this button element and its onClick event ...
          />
        </>
      ) : (
        // ... success state return path ...
      )}
    </div>
  );
};

export default Dashboard;