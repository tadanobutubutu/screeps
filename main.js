const fs = require('fs');
const path = require('path');

// Define the path to the affected HTML file
const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');

// Read the contents of the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Replace all occurrences of <th> without scope attribute with <th scope="col">
  const updatedData = data.replace(/<th\b[^>]*>/g, '<th scope="col">');

  // Write the updated contents back to the file
  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('File updated successfully.');
  });
});

// React components and related logic
import React, { useState, useEffect } from 'react';
interface DashboardProps { }

const Dashboard: React.FC<DashboardProps> = () => {
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    if (error) {
      navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fetchStats = (forceRefresh = false) => {
    // Your fetch logic here
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {error ? (
        <div>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          <pre style={{ color: '#c53030', backgroundColor: '#fff5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {error}
          </pre>
          <button onClick={copyErr} onMouseEnter={() => setErrCopyHover(true)} onMouseLeave={() => setErrCopyHover(false)} onFocus={() => setErrCopyHover(true)} onBlur={() => setErrCopyHover(false)} aria-label={copied ? 'コピー済み' : 'エラーをコピー'} title={copied ? 'コピー済み' : 'エラーをコピー'} style={{ backgroundColor: copied ? '#155d27' : '#004b73', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s ease-in-out', transform: errCopyHover ? 'scale(1.05)' : 'scale(1)', boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none', filter: errCopyHover ? 'brightness(1.1)' : 'none' }}>
            {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
          </button>
          <button onClick={() => fetchStats(true)} disabled={refreshing} onMouseEnter={() => setErrRetryHover(true)} onMouseLeave={() => setErrRetryHover(false)} style={{ backgroundColor: '#004b73', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '1rem', transition: 'all 0.2s ease-in-out', transform: errRetryHover ? 'scale(1.05)' : 'scale(1)', boxShadow: errRetryHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none', filter: errRetryHover ? 'brightness(1.1)' : 'none' }}>
            {refreshing ? '🔄 再試行中...' : '🔄 再試行'}
          </button>
        </div>
      ) : (
        <div>
          {/* Your success state content here */}
        </div>
      )}
    </main>
  );
};

export default Dashboard;