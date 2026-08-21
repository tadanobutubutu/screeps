tsx
import React from 'react';

interface DashboardProps {
  // ... define your props interface here
}

const Dashboard: React.FC<DashboardProps> = ({ /* props */ }) => {
  // ... your component state and functions

  return (
    <div>
      {/* Wrap the multiple main content blocks with a single <main> */}
      <main>
        {/* Original content that was inside the first <main> */}
        <h1>⚠️ エラー</h1>
        <pre /* ... */>{error}</pre>
        <button /* ... */>{copied ? '✅ コピー済み' : '📋 エラーをコピー'}</button>
        {/* ... other related content ... */}

        {/* Original content that was inside the second <main> */}
        <section>
          <h2>Retry or Fetch Stats</h2>
          <button onClick={() => fetchStats(true)} disabled={refreshing} /* ... */>
            {refreshing ? 'Refreshing...' : '🔄 Retry'}
          </button>
          {/* ... other related content ... */}
        </section>
      </main>
      {/* ... other non-landmark related content ... */}
    </div>
  );
};

export default Dashboard;