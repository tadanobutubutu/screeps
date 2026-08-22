import React, { useState } from 'react';

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch data and set data state
      const response = await fetch('/api/data');
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  return (
    <div>
      {error && <div>Error: {error}</div>}
      {data && (
        <main>
          {/* Render your data here */}
          <h1>Data Title</h1>
          {/* ... */}
        </main>
      )}
      {!error && !data && <button onClick={fetchData}>Load Data</button>}
    </div>
  );
};

export default Dashboard;