import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../lib/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

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

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardData(user.id);
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

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

  return (
    <div className="dashboard-container">
      <main>
        <h1>Welcome, {user.name}</h1>
        <div className="dashboard-content">
          {/* Dashboard content */}
          {data && (
            <>
              <section className="stats-section">
                <h2>Your Statistics</h2>
                {/* Stats content */}
              </section>
              <section className="recent-activity">
                <h2>Recent Activity</h2>
                {/* Activity content */}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;