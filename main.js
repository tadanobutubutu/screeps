import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../redux/actions/dashboardActions';
import { RootState } from '../redux/store';
import { DashboardData } from '../types/dashboardTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';

interface DashboardProps {
  // Add any props if needed
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (!isMounted) return null;

  if (loading) {
    return (
      <main className="dashboard-container">
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <section className="dashboard-container">
        <ErrorDisplay message={error} />
      </section>
    );
  }

  return (
    <main className="dashboard-container">
      {/* Dashboard content */}
      <div className="dashboard-content">
        {/* Render dashboard data */}
        {data && (
          <div className="data-display">
            {/* Your dashboard content here */}
          </div>
        )}
      </div>
    </main>
  );
};