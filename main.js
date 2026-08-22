// Main.js - Fixed REACT_025: Ensure only one <main> landmark
import React, { useState } from 'react';

function Dashboard() {
  const [error, setError] = useState(false);

  return (
    <div>
      {error ? (
        <section>
          <h2>Error</h2>
        </section>
      ) : (
        <main>
          <h1>Dashboard</h1>
        </main>
      )}
    </div>
  );
}

export default Dashboard;