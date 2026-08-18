import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchDashboardData } from '../store/dashboardSlice';
import { DashboardData } from '../types/dashboard';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardContent } from './DashboardContent';

interface DashboardProps {
  // Add any props your component might need
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

// Keep all existing exports
export { Dashboard };