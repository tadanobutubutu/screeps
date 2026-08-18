import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';
import { DashboardData } from '../types/dashboardTypes';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import DashboardCard from './DashboardCard';

interface DashboardProps {
  // Add any props if needed
}

const Dashboard: React.FC<DashboardProps> = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setIsError(true);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner />
      </div>
    );
  }

  const content = data && data.cards.map((card: DashboardData['cards'][0]) => (
    <DashboardCard key={card.id} {...card} />
  ));

  if (isError) {
    return (
      <ErrorDisplay message={error || 'Failed to load dashboard data'} />
    );
  }

  return (
    <main className="dashboard-main">
      {content}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Dashboard />
    </div>
  );
};

export const existingFunction = () => {
  // Some existing functionality
};

export const anotherExistingExport = () => {
  // More existing functionality
};

export default App;