import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/types';
import { DashboardData } from '../types/dashboardTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardContent } from './DashboardContent';

interface DashboardProps {
  // Add any props if needed
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setIsError(true);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-container">
        <ErrorDisplay message={error || 'Failed to load dashboard data'} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main>
        <DashboardContent data={data as DashboardData} />
      </main>
    </div>
  );
};

// Accessibility improvements added from origin/main
const AccessibleApp = ({ children }) => {
  // Add lang attribute to root element
  return (
    <div lang="en" className="app-container">
      {/* Add proper ARIA landmarks */}
      <header role="banner">
        {/* Header content */}
      </header>

      <main role="main">
        {/* Main content */}
        {children}
      </main>

      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
};

// Example of accessible table
const AccessibleTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.col1}</td>
            <td>{row.col2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Example of accessible SVG
const AccessibleSVG = () => {
  return (
    <svg role="img" aria-label="Description of the image">
      {/* SVG content */}
    </svg>
  );
};

// Example of proper link (instead of fake links)
const ProperLink = ({ href, children }) => {
  return <a href={href}>{children}</a>;
};

// Preserve all existing exports
export { Dashboard as default };

export {
  AccessibleApp,
  AccessibleTable,
  AccessibleSVG,
  ProperLink
};