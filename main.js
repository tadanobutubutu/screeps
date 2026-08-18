import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers/rootReducer';

const Dashboard: React.FC = () => {
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
      <div className="dashboard-loading">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <section className="dashboard-error">
        <h2>Error Loading Dashboard</h2>
        <p>Please try again later.</p>
      </section>
    );
  }

  return (
    <main className="dashboard-main">
      <h1>Dashboard Overview</h1>
      <div className="dashboard-content">
        {/* Dashboard content here */}
        {data && (
          <div>
            <p>Data loaded successfully!</p>
            {/* Render dashboard data */}
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;