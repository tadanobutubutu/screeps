tsx
import React from 'react';
import { useRef, useCallback } from 'react';
import './Dashboard.scss';

function Dashboard() {
  //... other Dashboard function code

  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>
      <main>
        {/* Render current content inside a main for only one element */}
        {renderErrorState()}
        {renderSuccessState()}
      </main>
      {/* Keep the copyErrorFunc and fetchStats functions outside the main element */}
      <button onClick={copyErrorFunc} aria-label={'Error copy button'}>
        {/* ... */}
      </button>
      <button onClick={fetchStats} disabled={refreshing} aria-label={'Refresh button'}>
        {/* ... */}
      </button>
    </div>
  );
}

// [... other functions...]

export default Dashboard;