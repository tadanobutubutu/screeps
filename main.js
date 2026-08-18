import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { fetchDashboardData } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardContent from './DashboardContent';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const result = await fetchDashboardData(user.id);
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  if (loading) {
    return (
      <main className="dashboard-container">
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-container">
        <ErrorMessage message={error} />
      </main>
    );
  }

  return (
    <main className="dashboard-container">
      <DashboardContent data={data} />
    </main>
  );
};

export default Dashboard;