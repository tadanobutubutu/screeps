tsx
import React, { useState } from 'react';

interface ErrorStateProps {
  error: string;
  copyErr: () => void;
  copied: boolean;
  setErrCopyHover: (hover: boolean) => void;
  errCopyHover: boolean;
  fetchStats: () => void;
  refreshing: boolean;
  setErrRetryHover: (hover: boolean) => void;
  errRetryHover: boolean;
}

interface SuccessStateProps {
  // ... (props for the success state)
}

const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  copyErr,
  copied,
  setErrCopyHover,
  errCopyHover,
  fetchStats,
  refreshing,
  setErrRetryHover,
  errRetryHover,
}) => {
  // ... (render the error state UI)
};

const SuccessState: React.FC<SuccessStateProps> = ({
  // ... (props for the success state)
}) => {
  // ... (render the success state UI)
};

const Dashboard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errCopyHover, setErrCopyHover] = useState<boolean>(false);
  const [errRetryHover, setErrRetryHover] = useState<boolean>(false);

  const handleCopyError = () => {
    // ... (copy error logic)
  };

  const handleRetryFetch = () => {
    // ... (retry fetch logic)
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      {error ? (
        <ErrorState
          error={error}
          copyErr={handleCopyError}
          copied={copied}
          setErrCopyHover={setErrCopyHover}
          errCopyHover={errCopyHover}
          fetchStats={handleRetryFetch}
          refreshing={refreshing}
          setErrRetryHover={setErrRetryHover}
          errRetryHover={errRetryHover}
        />
      ) : (
        <SuccessState /* ... (pass the necessary props) */ />
      )}
    </main>
  );
};

export default Dashboard;