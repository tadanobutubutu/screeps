// Before:
// <main>Content for success state</main>
// <main>Content for error state</main>

// After:
import React, { useState } from 'react';

const Dashboard = () => {
  const [state, setState] = useState('success'); // 'success' or 'error'

  const renderContent = () => {
    switch (state) {
      case 'success':
        return <main>Content for success state</main>;
      case 'error':
        return <main>Content for error state</main>;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderContent()}
      {/* Other components */}
    </div>
  );
};

export default Dashboard;