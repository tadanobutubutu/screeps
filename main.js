import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';
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

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="dashboard-error">
        <ErrorDisplay message={error} />
      </section>
    );
  }

  return (
    <main className="dashboard">
      {/* Dashboard content */}
      {data && (
        <div className="dashboard-content">
          {/* Render dashboard data */}
        </div>
      )}
    </main>
  );
};

export default Dashboard;