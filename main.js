import React, { useState, useEffect } from 'react';
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

  // Single main element that wraps both error and success states
  return (
    <main className="dashboard-container">
      {isError ? (
        <ErrorDisplay message={error || 'Failed to load dashboard data'} />
      ) : (
        <div className="dashboard-content">
          {data && data.cards.map((card: DashboardData['cards'][0]) => (
            <DashboardCard key={card.id} {...card} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Dashboard;