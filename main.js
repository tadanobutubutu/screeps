tsx
// Dashboard.tsx
import React from 'react';
import MainSection from './MainSection';
// ... rest of imports

const Dashboard = () => {
  // ... rest of the code
  return (
    <>
      <main>
        {/* error state JSX */}
      </main>
      <MainSection error={error} success={success} />
    </>
  );
};

export default Dashboard;