import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
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
  const [activeTab, setActiveTab] = useState<'stats' | 'charts'>('stats');

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <ErrorDisplay message={error} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <nav>
          <button
            onClick={() => setActiveTab('stats')}
            className={activeTab === 'stats' ? 'active' : ''}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={activeTab === 'charts' ? 'active' : ''}
          >
            Charts
          </button>
        </nav>
      </header>

      <main className="dashboard-main">
        {activeTab === 'stats' && <DashboardStats data={data} />}
        {activeTab === 'charts' && <DashboardCharts data={data} />}
      </main>

      <DashboardActions data={data} />
    </div>
  );
};