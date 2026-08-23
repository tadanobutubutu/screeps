// components/Dashboard.tsx

import React from 'react';

const Dashboard = ({ error, success }) => {
  return (
    <div>
      {/* Assuming there was a <main> element here, we remove it */}
      
      {/* Replace the <main> with a <section> for the error state */}
      {error && (
        <section aria-labelledby="error-title">
          <h2 id="error-title">Error</h2>
          <p>{error.message}</p>
        </section>
      )}

      {/* Replace the <main> with a <section> for the success state */}
      {success && (
        <section aria-labelledby="success-title">
          <h2 id="success-title">Success</h2>
          <p>{success.message}</p>
        </section>
      )}
    </div>
  );
};

export default Dashboard;