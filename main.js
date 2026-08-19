import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardContent from './DashboardContent';

// For app/root.tsx
const AppLayout = ({ children }) => (
  <body lang="en" className="min-h-screen flex flex-col">
    <main role="main">{children}</main>
  </body>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <body lang="en">
    <main role="main">{children}</main>
  </body>
);

// For dashboard/app/dependency-graph/page.tsx
const DependencyGraph = () => (
  <main role="main">
    <table id="table-rotated" aria-label="Dependency graph table">
      {/* Table content */}
    </table>
  </main>
);

// For docs/app/index.tsx
const DocsIndex = () => (
  <main role="main">
    <div className="container">
      <h2>Quality & Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a href="/dependency-graph" aria-label="View Plato Code Complexity Report">Plato Code Complexity Report</a>
        <a href="/dependency-graph" aria-label="View Dependency Graph">Dependency Graph</a>
      </div>
    </div>
  </main>
);

const Dashboard: React.FC = () => {
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
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={error} />
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardContent data={data} />
    </div>
  );
};

export default Dashboard;