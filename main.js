tsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reducers';
import { ThunkDispatch } from 'redux-thunk';
import { AppDispatch } from '../store';
import axios from 'axios';

type ErrorMessage = {
  reason: string;
};

const Dashboard = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.user.isAuthenticated);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, unknown>>();

  const authFetchStats = async () => {
    // ...
  };

  const fetchStats = (refresh: boolean) => {
    // ...
  };

  const copyErr = () => {
    // ...
  };

  useEffect(() => {
    if (refreshing) {
      fetchStats(true);
    }
  }, [refreshing]);

  useEffect(() => {
    if (!copied) {
      navigator.clipboard.writeText(error);
      setCopied(true);
    }
  }, [error, copied]);

  if (isAuthenticated) {
    // Replace with a single main element and other semantic elements as needed
    return (
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1 style={{ color: '#b71c1c' }}>dash</h1>
        <section>
          <button onClick={() => authFetchStats()} disabled={refreshing}>
            Refresh
          </button>
          <pre
            aria-label="stats-box"
            style={{
              color: '#c53030',
              backgroundColor: '#fff5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {/* stats */}
          </pre>
        </section>

        {/* error and copy-error code here */}
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>Please login to access the dashboard</h1>
    </main>
  );
};

export default Dashboard;