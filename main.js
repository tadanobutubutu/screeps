import React from 'react';

const Dashboard = () => {
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const handleError = (error) => {
    setError(error);
    setSuccess(null);
  };

  const handleSuccess = (success) => {
    setSuccess(success);
    setError(null);
  };

  return (
    <div>
      {error && (
        <main>
          <h1>Error</h1>
          <p>{error.message}</p>
        </main>
      )}
      {success && (
        <main>
          <h1>Success</h1>
          <p>{success.message}</p>
        </main>
      )}
    </div>
  );
};

export default Dashboard;