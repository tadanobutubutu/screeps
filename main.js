import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';
import { DashboardData } from '../types/dashboardTypes';
import { ErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './LoadingSpinner';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardActions } from './DashboardActions';

interface DashboardProps {
  // Add any props your component might receive
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [activeTab, setActiveTab] = useState<string>('stats');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

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

  if (!data) {
    return (
      <div className="dashboard-container">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <nav>
          <button onClick={() => setActiveTab('stats')}>Stats</button>
          <button onClick={() => setActiveTab('charts')}>Charts</button>
          <button onClick={() => setActiveTab('actions')}>Actions</button>
        </nav>
      </header>

      <main className="dashboard-main">
        {activeTab === 'stats' && <DashboardStats data={data} />}
        {activeTab === 'charts' && <DashboardCharts data={data} />}
        {activeTab === 'actions' && <DashboardActions data={data} />}
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} Dashboard App</p>
      </footer>
    </div>
  );
};

// Keep all existing exports
export default Dashboard;