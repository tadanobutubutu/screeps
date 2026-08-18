import React from 'react';

const Dashboard = ({ isError, errorMessage, children }) => {
  return (
    <div className="dashboard-container">
      {isError ? (
        <div className="error-state">
          <h2>Error</h2>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <main className="dashboard-main">
          {children}
        </main>
      )}
    </div>
  );
};

export default Dashboard;