tsx
import React, { useState, useEffect } from 'react';

// ... (your import statements)

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  // ... (your functionality and event handlers)

  return (
    <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {renderErrorState(error, setError, refreshing, setRefreshing, copyErr, setCopied,
        setErrCopyHover, setErrRetryHover)}
      {renderSuccessState(data, setError, refreshing, setRefreshing)}
    </section>
  );
};

// ... (your other components, functions, exports, etc.)

export default Dashboard;