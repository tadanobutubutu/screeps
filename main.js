// Sample component demonstrating the fix for REACT_025
// Replace multiple <main> elements with a single <main> and use <section> for other regions

import React, { useState, useEffect } from 'react';

function DataComponent({ fetchData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fetchData]);

  if (loading) {
    return (
      <main>
        <section aria-busy="true" aria-label="Loading">
          <p>Loading...</p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section role="alert" aria-live="polite">
          <h2>Error</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <h1>Data</h1>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default DataComponent;