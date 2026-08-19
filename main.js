import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardContent from './DashboardContent';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFooter } from './DashboardFooter';

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData(user.id);
        setData(dashboardData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <section className="flex-grow flex items-center justify-center p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </section>
        <DashboardFooter />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-grow p-4">
        <DashboardContent data={data} />
      </main>
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;