import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../redux/actions/dashboardActions';
import { RootState } from '../redux/store';
import { DashboardData } from '../types/dashboard';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardActions } from './DashboardActions';

interface DashboardProps {
  // Add any props if needed
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

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

  if (!data) {
    return (
      <section className="dashboard-no-data">
        <p>No data available</p>
      </section>
    );
  }

  return (
    <main className="dashboard">
      <DashboardStats data={data} />
      <DashboardCharts data={data} />
      <DashboardActions data={data} />
    </main>
  );
};

// Keep all existing exports and functions
export { DashboardData, ErrorDisplay, LoadingSpinner, DashboardStats, DashboardCharts, DashboardActions };