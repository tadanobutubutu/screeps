import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../redux/actions/dashboardActions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <section className="dashboard-error">
        <h2>Error</h2>
        <p>{error.message}</p>
      </section>
    );
  }

  return (
    <main className="dashboard">
      <h1>Dashboard</h1>
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