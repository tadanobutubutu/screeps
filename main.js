// main.js - React component with fixed unique landmarks

import React from 'react';

export function SomeComponent({ data, error }) {
  // Single main landmark with conditional content inside
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {error ? (
        <div className="error-state">
          <h1>Error Occurred</h1>
          <p>{error.message}</p>
        </div>
      ) : data ? (
        <div className="success-state">
          <h1>Success</h1>
          <p>{data.content}</p>
        </div>
      ) : (
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      )}
    </main>
  );
}

export default SomeComponent;