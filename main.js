tsx
import React from 'react';

interface DashboardProps {
  // Define other props if necessary
}

const Dashboard: React.FC<DashboardProps> = () => {
  // State variables and functions would go here

  return (
    <div>
      <main>
        {/* Main content goes here */}
      </main>
      {error && (
        <section>
          <h1>⚠️ エラー</h1>
          <pre aria-label="エラーメッセージ詳細">
            {error}
          </pre>
          {/* Copy error button and retry button go here */}
        </section>
      )}
      {success && (
        <section>
          {/* Success state content goes here */}
        </section>
      )}
      {/* Other content goes here */}
    </div>
  );
};

export default Dashboard;