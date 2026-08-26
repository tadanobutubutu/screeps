tsx
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';

type PropType = {
  error: any;
  refreshing: boolean;
  copyErr: () => void;
  fetchStats: (flag: boolean) => void;
};

type StateType = {
  copied: boolean;
  errCopyHover: boolean;
};

const DashboardError: React.FC<PropType> = ({ error, refreshing, copyErr, fetchStats }) => {
  const [state, setState] = useState<StateType>({ copied: false, errCopyHover: false });

  useEffect(() => {
    setState({ copied: false });
  }, [error]);

  // Create a variable with the content of the error state return path
  const errorStateContent = (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
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
      <button
        onClick={copyErr}
        onMouseEnter={() => setState((prevState) => ({ errCopyHover: true }))}
        onMouseLeave={() => setState((prevState) => ({ errCopyHover: false }))}
        onFocus={() => setState((prevState) => ({ errCopyHover: true }))}
        onBlur={() => setState((prevState) => ({ errCopyHover: false }))}
        aria-label={state.copied ? 'コピー済み' : 'エラーをコピー'}
        title={state.copied ? 'コピー済み' : 'エラーをコピー'}
        style={{
          backgroundColor: state.copied ? '#155d27' : '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: state.errCopyHover ? 'scale(1.05)' : 'scale(1)',
          boxShadow: state.errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
          filter: state.errCopyHover ? 'brightness(1.1)' : 'none',
        }}
      >
        {state.copied ? '✅ コピー済み' : '📋 エラーをコピー'}
      </button>
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => setState((prevState) => ({ errRetryHover: true }))}
        onMouseLeave={() => setState((prevState) => ({ errRetryHover: false }))}
        // ... rest of the code
      </button>
    </div>
  );

  // Replace the error state return path with the modified errorStateContent
  return (
    // ... rest of the JSX structure
    refreshing ? (
      <p>{i18n.t('loading')}</p>
    ) : !_.isEmpty(error) ? (
      // Replace this line with errorStateContent
      errorStateContent
    ) : null
    // ... rest of the JSX structure
  );
};

export default DashboardError;