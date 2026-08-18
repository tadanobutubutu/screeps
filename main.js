import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboard';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardCard } from './DashboardCard';

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
    <main className="dashboard-container">
      <h1>Dashboard</h1>
      {data && (
        <div className="dashboard-grid">
          {data.map((item: DashboardData) => (
            <DashboardCard key={item.id} data={item} />
          ))}
        </div>
      )}
    </main>
  );
};