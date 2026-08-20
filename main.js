// components/Dashboard.tsx

import React, { useState } from 'react';

const Dashboard = () => {
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCopyError = () => {
    setCopied(true);
  };

  const fetchStats = (retry) => {
    setRefreshing(true);
    // Implementation omitted for brevity
  };

  return (
    <div className="dashboard">
      {/* Error state - Fixed: using <section> instead of <main> to comply with REACT_025 */}
      <section 
        style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
          onClick={handleCopyError}
          onMouseEnter={() => setCopied(true)}
          onMouseLeave={() => setCopied(false)}
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
            transform: copied ? 'scale(1.05)' : 'scale(1)',
            boxShadow: copied ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
            filter: copied ? 'brightness(1.1)' : 'none',
          }}
        >
          {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
        </button>
        <button
          onClick={fetchStats(true)}
          disabled={refreshing}
          onMouseEnter={() => setCopied(true)}
          onMouseLeave={() => setCopied(false)}
        >
          再試行
        </button>
      </section>

      {/* Success state - Ensuring consistent landmark type */}
      <section 
        style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h2>成功</h2>
        <p>処理が完了しました。</p>
      </section>
    </div>
  );
};

export default Dashboard;