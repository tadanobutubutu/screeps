tsx
import React from 'react';
import { useId } from 'react';

interface DashboardProps {
  // ... define your props interface here
}

const Dashboard: React.FC<DashboardProps> = ({ /* props */ }) => {
  // ... your component state and functions

  const formErrorId = useId();
  const statsResetch Id = useId();

  return (
    <div lang="en">
      {/* Wrap the multiple main content blocks with a single <main> */}
      <main>
        {/* Original content that was inside the first <main> */}
        <h1>⚠️ エラー</h1>
        <pre id={formErrorId} /* ... */>{error}</pre>
        <button /** id for accessibility */ { id: formErrorId + '-copy-btn' }>
          {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
        </button>
        {/* ... other related content ... */}

        {/* Original content that was inside the second <main> */}
        <section>
          <h2>Retry or Fetch Stats</h2>
          <button onClick={() => fetchStats(true)} id={statsResetchId} disabled={refreshing} /* ... */}>
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