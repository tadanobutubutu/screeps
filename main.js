import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';
import { DashboardData } from '../types/dashboardTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardCard } from './DashboardCard';

interface DashboardProps {
  // Add any props if needed
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setDashboardData(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <section className="dashboard-header">
        <h1>Dashboard Overview</h1>
      </section>
      <main className="dashboard-main">
        <div className="dashboard-grid">
          {dashboardData.cards.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </main>
      <section className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </section>
    </div>
  );
};