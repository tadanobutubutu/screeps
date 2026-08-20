tsx
// Dashboard.tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    // copy error implementation
  };

  const fetchStats = (force: boolean) => {
    // fetch stats implementation
  };

  return (
    <div>
      {/* Original first <main> */}
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
        {/* ... rest of the original <main> content ... */}
      </main>

      {/* New <section> for the second <main> content */}
      <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#4f8e1d' }}>✅ Success</h1>
        {/* ... rest of the content that was originally in the second <main> ... */}
      </section>

      {/* ... rest of the component ... */}
    </div>
  );
};

export default Dashboard;