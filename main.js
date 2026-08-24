// Existing main.js content before conflict markers
import React from 'react';

// ... (existing imports and code)

const Dashboard = () => {
  // ... (existing code)

  const renderErrorState = () => {
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
        {/* ... (rest of the error state code) */}
      </div>
    );
  };

  const renderSuccessState = () => {
    return (
      <main>
        {/* ... (content for success state) */}
      </main>
    );
  };

  return (
    <div>
      {/* ... (other code) */}
      {error ? renderErrorState() : renderSuccessState()}
      {/* ... (other code) */}
    </div>
  );
};

export default Dashboard;

// ... (existing exports and code)

// New main.js content after conflict markers
// The conflict markers are assumed to be related to the duplication of the <main> element.
// The below code should be placed after the conflict markers to resolve the issue.

// Assuming that the duplication is on line 320, here is the updated code snippet:
// const renderErrorState = () => {
//   return (
//     // ... (rest of the error state code)
//   );
// };

// const renderSuccessState = () => {
//   return (
//     <main>
//       {/* ... (content for success state) */}
//     </main>
//   );
// };

// The rest of the existing code remains unchanged.