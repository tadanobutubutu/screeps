// main.js
import React from 'react';

// Import any other necessary components or hooks here

// Example of an existing component that might be using a <a> with href="#"
const OldComponent = () => {
  return (
    <div>
      {/* Example of a non-interactive link */}
      <a id="unrotate" href="#">rotate back</a>
      {/* Other content */}
    </div>
  );
};

// New component that uses a <button> for the same purpose
const NewComponent = () => {
  return (
    <div>
      {/* Replace the <a> with a <button> */}
      <button id="unrotate" onClick={() => {/* Your action here */}}>rotate back</button>
      {/* Other content */}
    </div>
  );
};

// Component with proper landmark structure - single <main> landmark
// Error state uses <section> instead of <main> to avoid multiple main landmarks
const ComponentWithLandmarkFix = ({ hasError, error, onRetry, onCopy, copied, isRefreshing }) => {
  if (hasError) {
    // Error state: use <section> instead of <main> for non-primary landmark
    return (
      <section 
        aria-label="エラー表示"
        style={{ padding: '2rem', fontFamily: 'monospace' }}
      >
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
          onClick={onCopy}
          aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
          title={copied ? 'コピー済み' : 'エラーをコピー'}
          style={{
            backgroundColor: copied ? '#155d27' : '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
        </button>
        <button
          onClick={() => onRetry(true)}
          disabled={isRefreshing}
          aria-label="再試行"
          style={{
            backgroundColor: '#004b73',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 再試行
        </button>
      </section>
    );
  }

  // Success state: use <main> for the primary landmark
  return (
    <main 
      id="main-content"
      aria-label="メインポンテンツ"
      style={{ padding: '2rem' }}
    >
      <h1>成功</h1>
      <p>コンテンツが正常に読み込まれました。</p>
    </main>
  );
};

// Existing code continues here, preserving any exports or functions
export default OldComponent; // Exporting OldComponent for now to preserve the existing state

// Any new functions or changes you need to add, according to the issue, go here
export { NewComponent, ComponentWithLandmarkFix };

// Ensure that any other components or parts of the application that reference OldComponent
// are updated to use NewComponent instead.