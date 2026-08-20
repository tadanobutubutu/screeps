import React from 'react';
import ReactDOM from 'react-dom';
import ...

// Main application logic
function rotateContent(direction) {
  const content = ...
  if (content) {
    const rotation = direction === 'back' ? 0 : 90;
    content.style.transform = `rotate(${rotation}deg)`;
  }
}

// Setup event listeners
function setupEventListeners() {
  const unrotateButton = ...
  if (unrotateButton) {
    ... () => {
      rotateContent('back');
    });
  }

  const rotateButton = ...
  if (rotateButton) {
    ... () => {
      rotateContent('forward');
    });
  }
}

// Initialize when DOM is ready
... setupEventListeners);

// React rendering setup
ReactDOM.render(
  <React.StrictMode>
    {/* Other components */}
    <div id="unrotate">
      {/* Replace the anchor tag with a button */}
      <button id="unrotate" onClick={() => rotateContent('back')}>
        rotate back
      </button>
    </div>
    {/* Other components */}
  </React.StrictMode>,
  ...
);

// Error state component with accessible landmark structure
const ErrorState = ({ error, copyErr, copied, setErrCopyHover, errCopyHover, setErrRetryHover, fetchStats, refreshing }) => (
  <section aria-label="エラー表示" style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
        backgroundColor: '#004b73',
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginLeft: '0.5rem',
      }}
    >
      🔄 再試行
    </button>
  </section>
);

// Success state component with accessible landmark structure
const SuccessState = ({ data, formatNumber, formatPercentage, getChangeColor, t }) => (
  <section aria-label="統計情報表示">
    <main style={{ padding: '2rem' }}>
      <h1>{t('statistics')}</h1>
      {/* Stats content */}
    </main>
  </section>
);

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotateContent,
    setupEventListeners,
    ErrorState,
    SuccessState
  };
}