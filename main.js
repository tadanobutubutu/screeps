tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  // ... other state variables

  const handleError = (error: string) => {
    setError(error);
    setSuccess(null);
  };

  const handleSuccess = (success: string) => {
    setSuccess(success);
    setError(null);
  };

  const handleFetchStats = () => {
    // Simulate fetching data
    setRefreshing(true);
    // After fetching, set state based on success or failure
    // For example:
    // if (data.isError) {
    //   handleError(data.errorMessage);
    // } else {
    //   handleSuccess(data.successMessage);
    // }
    setRefreshing(false);
  };

  // Render only one <main> element at a time
  return (
    <div>
      {error && (
        <main>
          <h1>⚠️ エラー</h1>
          {/* ... rest of the error UI */}
        </main>
      )}
      {success && (
        <main>
          <h1>🎉 Success</h1>
          {/* ... rest of the success UI */}
        </main>
      )}
      {/* ... rest of the component */}
    </div>
  );
};

export default Dashboard;