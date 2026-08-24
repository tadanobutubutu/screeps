tsx
import React, { ReactNode, useEffect, useState } from 'react';
import { Text, Box, Button, Spinner } from '@chakra-ui/react';
import { Tooltip } from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import { feetToMeters, formatDate } from 'screeps-util-lib';
import { Link } from 'react-router-dom';
import { isResponseError, hasMore } from 'screeps-util-lib';

const useStyles = makeStyles((theme) => ({
  mainError: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '100vh',
  },
  errMessage: {
    fontWeight: 'bold',
    color: '#b71c1c',
  },
  errCopyButton: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: 'white',
    backgroundColor: '#004b73',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#155d27',
    },
  },
}));

export type DashboardStatType = {
  showMore: boolean;
  hadMore: boolean;
};

type Props = {
  stats: any;
  fetchStats: (forceUpdate: boolean) => void;
  error: string | null;
  refreshing: boolean;
  copyErr: () => void;
};

const Dashboard: React.FC<Props> = ({
  stats,
  fetchStats,
  error,
  refreshing,
  copyErr,
}) => {
  const classes = useStyles();
  const [errCopyHover, setErrCopyHover] = useState(false);
  const [showStats, setShowStats] = useState<DashboardStatType>({ showMore: false, hadMore: false });

  useEffect(() => {
    // Check for errors
    if (error) {
      setShowStats({ showMore: false, hadMore: false });
    }
  }, [error]);

  const handleStatsShowMore = () => {
    setShowStats((prev) => ({ ...prev, showMore: !prev.showMore }));
    fetchStats(false);
  };

  return (
    <>
      <main data-testid={error ? 'error-main' : undefined} tabIndex={0} role="main">
        {/* Add more code for your success state here */}
        {error && (
          <div className={classes.mainError}>
            <h1 className={classes.errMessage}>⚠️ エラー</h1>
            <pre
              tabIndex={0}
              aria-label="エラーメッセージ詳細"
              style={{
                color: '#c53030',
                backgroundColor: '#fff5f5',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {error}
            </pre>
            <Button
              onClick={copyErr}
              onMouseEnter={() => setErrCopyHover(true)}
              onMouseLeave={() => setErrCopyHover(false)}
              onFocus={() => setErrCopyHover(true)}
              onBlur={() => setErrCopyHover(false)}
              aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
              title={copied ? 'コピー済み' : 'エラーをコピー'}
              className={classes.errCopyButton}
            >
              {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
            </Button>
            <Button
              onClick={() => fetchStats(true)}
              disabled={refreshing}
              onMouseEnter={() => setErrRetryHover(true)}
              onMouseLeave={() => setErrRetryHover(false)}
            >
              {refreshing ? <Spinner size="sm" /> : '更新'}
            </Button>
          </div>
        )}

        {/* Add more code for your success state here */}
      </main>
      {/* Other components and return statement should remain the same as in the original code */}
    </>
  );
};

export default Dashboard;