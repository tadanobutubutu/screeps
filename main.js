import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboard';
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

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <section className="dashboard-loading">
        <LoadingSpinner />
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-error">
        <ErrorDisplay message={error} />
      </section>
    );
  }

  return (
    <main className="dashboard-main">
      {/* Dashboard content */}
      <h1>Dashboard</h1>
      <div className="dashboard-content">
        {/* Render dashboard data */}
        {data && (
          <div className="data-container">
            {/* Data display components */}
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;