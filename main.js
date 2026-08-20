<html lang="en">
import React, { useState, useEffect } from 'react';

// New changes to fix the REACT_027 issue
// Add the scope attribute to the <th> elements in the affected files

// Example of how to fix the issue in a single file
// Replace the following line:
// <th><div>src/constants.js</div></th>
// With:
// <th scope="col"><div>src/constants.js</div></th>

// Repeat the above change for all occurrences in the affected files, such as:
// <th><div>src/managers/roomManager.js</div></th>
// <th><div>src/managers/spawnManager.js</div></th>
// ...
// <th><div>src/roles/builder.js</div></th>
// ...

const Dashboard = () => {
  const copyErr = () => {
    // Your existing copyErr implementation
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
      </main>
    );
  }

  // Success state content wrapped in a single main element
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {/* Your existing success state content */}
    </main>
  );
};

export default Dashboard;
```