// Import external package for internationalization
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Main functional component
const Main = ({ data }) => {
  // Address critical issue: React Language Attribute
  // Wrap all child nodes in a top-level Lang tag
  return (
    <div lang="en">
      {/* Rest of the code as before */}
    </div>
  );
};

// Table component with proper role, headers, and accessibility properties
// (Adjust as needed to fit your existing table structure)
const Table = ({ data }) => {
  return (
    <table role="grid" aria-label="My Table">
      {/* ... add thead, tbody, and tr/th/td structure depending on data structure ... */}
      {/* Address warning issue: React Table Structure */}
      {/* Ensure the table headers have associated scope attributes */}
      {/* ... adjust row and cell structure to add scope="col" to headers ... */}
    </table>
  );
};

// Error display component - use section instead of main to avoid duplicate landmark
const ErrorDisplay = ({ error, copyErr, copied, errCopyHover, setErrCopyHover, fetchStats, refreshing, errRetryHover, setErrRetryHover }) => {
  return (
    <section aria-labelledby="error-heading">
      <h2 id="error-heading" style={{ color: '#b71c1c' }}>⚠️ エラー</h2>
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
        onMouseEnter={() => setErrCopyHover(true)}
        onMouseLeave={() => setErrCopyHover(false)}
        onFocus={() => setErrCopyHover(true)}
        onBlur={() => setErrCopyHover(false)}
        aria-label={copied ? 'コピー済み' : 'エラーをコピー'}
        title={copied ? 'コピー済み' : 'エラーをコピー'}
        style={{
          backgroundColor: copied ? '#155d27' : '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          transform: errCopyHover ? 'scale(1.05)' : 'scale(1)',
          boxShadow: errCopyHover ? '0 4px 10px rgba(0, 75, 115, 0.3)' : 'none',
          filter: errCopyHover ? 'brightness(1.1)' : 'none',
        }}
      >
        {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
      </button>
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        onMouseEnter={() => setErrRetryHover(true)}
        onMouseLeave={() => setErrRetryHover(false)}
        onFocus={() => setErrRetryHover(true)}
        onBlur={() => setErrRetryHover(false)}
        aria-label="再試行"
        title="再試行"
        style={{
          backgroundColor: '#004b73',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginLeft: '0.5rem',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        🔄 再試行
      </button>
    </section>
  );
};

// Prop types for the Main and Table components
Main.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ /* data structure */ })).isRequired,
};

ErrorDisplay.propTypes = {
  error: PropTypes.string.isRequired,
  copyErr: PropTypes.func.isRequired,
  copied: PropTypes.bool.isRequired,
  errCopyHover: PropTypes.bool.isRequired,
  setErrCopyHover: PropTypes.func.isRequired,
  fetchStats: PropTypes.func.isRequired,
  refreshing: PropTypes.bool.isRequired,
  errRetryHover: PropTypes.bool.isRequired,
  setErrRetryHover: PropTypes.func.isRequired,
};

export { Main, Table, ErrorDisplay };
export default Main;