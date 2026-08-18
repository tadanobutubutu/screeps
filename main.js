import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardData } from '../types/dashboardTypes';

const Dashboard: React.FC = () => {
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

  const handleRotate = () => {
    // Add rotation functionality should this be required
  };

  if (loading) {
    return (
      <main>
        <div className="loading-spinner">Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <section className="error-state">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </section>
    );
  }

  if (!dashboardData) {
    return (
      <section className="no-data">
        <h2>No Data Available</h2>
        <p>Please try again later.</p>
      </section>
    );
  }

  return (
    <main className="dashboard-container">
      <h1>Dashboard</h1>
      <button className="rotate-button" onClick={handleRotate}>
        <span>rotate back</span>
      </button>
      {/* Dashboard content */}
    </main>
  );
};

export default Dashboard;