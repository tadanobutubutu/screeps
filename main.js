tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [errRetryHover, setErrRetryHover] = useState(false);

  const copyErr = () => {
    // Implementation to copy error message
  };

  const fetchStats = (force?: boolean) => {
    // Implementation to fetch stats
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <MainContent error={error} success={success} refreshing={refreshing} />
      <Footer />
    </div>
  );
};

const MainContent: React.FC<{ error?: string; success?: any; refreshing?: boolean }> = ({ error, success, refreshing }) => {
  if (error) {
    return <ErrorState error={error} />;
  } else if (success) {
    return <SuccessState success={success} />;
  } else if (refreshing) {
    return <RefreshingState />;
  } else {
    return <NoContent />;
  }
};

const ErrorState: React.FC<{ error: string }> = ({ error }) => {
  // Render error state
};

const SuccessState: React.FC<{ success: any }> = ({ success }) => {
  // Render success state
};

const RefreshingState: React.FC = () => {
  // Render refreshing state
};

const NoContent: React.FC = () => {
  // Render no content state
};

const Footer: React.FC = () => {
  // Render footer
};

export default Dashboard;