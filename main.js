// Hypothetical Dashboard.tsx component before the fix
import React from 'react';

const Dashboard = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    // Fetch data and handle loading/error state
    // ...
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <main>Error: {error.message}</main>;
  }

  return (
    <main>
      <div>Data: {data}</div>
    </main>
  );
};

export default Dashboard;