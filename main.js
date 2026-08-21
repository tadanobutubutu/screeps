tsx
import React from 'react';

// Assuming the Dashboard component has a type DashboardProps
const Dashboard = ({ /* props */ }) => {
  const [isError, setIsError] = React.useState(false);

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <ErrorSection visible={isError} />
      <SuccessSection visible={!isError} />
    </main>
  );
};

const ErrorSection = ({ visible }) => {
  if (!visible) return null;
  return (
    <>
      <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
      {/* ... rest of the error section */}
    </>
  );
};

const SuccessSection = ({ visible }) => {
  if (!visible) return null;
  return (
    <>
      {/* ... rest of the success section */}
    </>
  );
};

export default Dashboard;