import React from 'react';

const MyComponent = ({ status, data, error }) => {
  // Keep a single <main> landmark and use conditional rendering for different states
  return (
    <main>
      {status === 'loading' && (
        <div className="loading">Loading...</div>
      )}
      
      {status === 'error' && (
        <div className="error">
          <h1>Error</h1>
          <p>{error}</p>
        </div>
      )}
      
      {status === 'success' && (
        <div className="success">
          <h1>Success</h1>
          <p>{data}</p>
        </div>
      )}
    </main>
  );
};

export default MyComponent;