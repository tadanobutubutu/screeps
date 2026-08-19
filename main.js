import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface DashboardData {
  // Define your dashboard data structure here
  [key: string]: any;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {error ? (
        <section className="flex items-center justify-center h-full">
          <ErrorMessage message={error} />
        </section>
      ) : !data ? (
        <section className="flex items-center justify-center h-full">
          <p>No data available</p>
        </section>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          {/* Render your dashboard data here */}
        </main>
      )}
    </div>
  );
};

export default Dashboard;