// Import required libraries for React.
import React from 'react';
import PropTypes from 'prop-types';

// Import custom library for handling accessibility table headers as requested by REACT_027 rule.
// You may have to install this package (e.g., `npm install react-accessible-table`).
import { useTable, useSortBy } from 'react-table';

// Avoid using 'notice' and 'you' as variable names, which are causing syntax errors.
// Update the printNotice() and printYou() functions using a different variable name.

// Main Component for Dashboard or Error Display
const MainComponent = ({ error, stats, fetchingStats, refreshing, setErrCopyHover, setErrRetryHover, copied }) => {
    if (error) {
        return (
            <html lang="en">
                <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
                        onClick={() => navigator.clipboard.writeText(error)}
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
                        style={{
                            backgroundColor: '#004b73',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginLeft: '1rem',
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        {refreshing ? 'リフレッシュ中...' : '🔄 再試行'}
                    </button>
                </section>
            </html>
        );
    }

    return (
        <html lang="en">
            <section style={{ padding: '2rem' }}>
                <h1 style={{ color: '#2b6cb0' }}>📊 ダッシュボード</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {Object.entries(stats).map(([key, value]) => (
                        <div
                            key={key}
                            style={{
                                backgroundColor: '#f7fafc',
                                borderRadius: '8px',
                                padding: '1rem',
                                flex: '1 1 200px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <h2 style={{ marginTop: 0, color: '#2c5282' }}>{key}</h2>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2b6cb0' }}>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    style={{
                        backgroundColor: '#2b6cb0',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        transition: 'all 0.2s ease-in-out',
                    }}
                    onMouseEnter={() => setErrRetryHover(true)}
                    onMouseLeave={() => setErrRetryHover(false)}
                >
                    {refreshing ? 'リフレッシュ中...' : '🔄 データをリフレッシュ'}
                </button>
            </section>
        </html>
    );
};

// Table Component with Accessibility Features
const MyTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable({ columns, data }, useSortBy);

  // Enable accessibility features for table headers as requested by REACT_027 rule.
  return (
    <table {...getTableProps()} aria-labelledby="table-Titel">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                id={`header-${column.id}`}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

MyTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

// Export named MyTable component
export { MyTable };

// Content Component with English Language Attribute
const ContentInEnglish = () => (
  <div lang="en-US">Content in English</div>
);

// Landmarks Component with Accessibility Features
export const MyLandmarks = () => (
  <>
    <header role="banner" id="landmarks-banner">
      <h1 role="heading" id="landmarks-title">My Landmarks</h1>
    </header>
  </>
);

// Export default MainComponent
export default MainComponent;