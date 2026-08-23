import React from 'react';

const Dashboard = ({ error, success }) => {
  return (
    <main>
      {error && (
        <section role="region" aria-label="Error">
          {/* Error content here */}
        </section>
      )}
      {success && (
        <section role="region" aria-label="Success">
          {/* Success content here */}
        </section>
      )}
    </main>
  );
};

export default Dashboard;