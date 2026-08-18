import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';
import { DashboardData } from '../types/dashboardTypes';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardStats from './DashboardStats';
import DashboardCharts from './DashboardCharts';
import DashboardActions from './DashboardActions';

interface DashboardProps {
  // Add any props if needed
}

const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [activeTab, setActiveTab] = useState<'stats' | 'charts'>('stats');

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
        <ErrorMessage message={error} />
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
        <div className="tab-switcher">
          <button
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => setActiveTab('stats')}
          >
            Stats
          </button>
          <button
            className={activeTab === 'charts' ? 'active' : ''}
            onClick={() => setActiveTab('charts')}
          >
            Charts
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        {activeTab === 'stats' && <DashboardStats data={data} />}
        {activeTab === 'charts' && <DashboardCharts data={data} />}
      </section>

      <DashboardActions data={data} />
    </div>
  );
};

export default Dashboard;