import React from 'react';

// Hypothetical component for error state
const ErrorState = ({ errorMessage }) => (
  <section>
    <h2>Error</h2>
    <p>{errorMessage}</p>
  </section>
);

// Hypothetical component for success state
const SuccessState = ({ successMessage }) => (
  <section>
    <h2>Success</h2>
    <p>{successMessage}</p>
  </section>
);

// Dashboard component
const Dashboard = ({ isLoading, isError, errorMessage, successMessage }) => {
  // Only render one of the states at a time
  const renderState = () => {
    if (isLoading) {
      // Render loading state
      return <div>Loading...</div>;
    } else if (isError) {
      return <ErrorState errorMessage={errorMessage} />;
    } else if (successMessage) {
      return <SuccessState successMessage={successMessage} />;
    }
    // If none of the states are applicable, render a default state or nothing
    return null;
  };

  return (
    <div>
      {/* Only one main element should be present */}
      <main>
        {renderState()}
      </main>
    </div>
  );
};

export default Dashboard;