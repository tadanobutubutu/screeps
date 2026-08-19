import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData(user.id);
        setData(dashboardData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <section className="dashboard-error">
        <ErrorMessage message={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="dashboard-empty">
        <p>No data available</p>
      </section>
    );
  }

  return (
    <main className="dashboard">
      {/* Dashboard content */}
      <h1>Welcome, {user?.name}</h1>
      <div className="dashboard-stats">
        {/* Render dashboard stats */}
      </div>
      <div className="dashboard-content">
        {/* Render dashboard content */}
      </div>
    </main>
  );
};

export default Dashboard;