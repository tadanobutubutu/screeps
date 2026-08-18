import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData } from '../lib/api';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { DashboardContent } from './DashboardContent';

interface DashboardData {
  // Define the shape of dashboard data based on API response
  [key: string]: any;
}

interface User {
  id: string;
  name: string;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth<User>();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
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

  if (!data) {
    return (
      <div className="dashboard-container">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <main>
        <h1>Welcome, {user?.name}</h1>
        <DashboardContent data={data} />
      </main>
    </div>
  );
};

export { Dashboard };
export default Dashboard;

// ReactDOM setup code from origin/main
import ReactDOM from 'react-dom/client';
import App from './App';

// For app/layout.tsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main className="min-h-screen flex flex-col">
      <App />
    </main>
  </React.StrictMode>
);

// For dashboard/app/layout.tsx
ReactDOM.createRoot(document.getElementById('dashboard-root')).render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);

// For docs/index.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const DocsIndex = () => (
  <main>
    <div className="container">
      <h2>Quality & Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>
  </main>
);

// For docs/dependency-graph.html
// This would be handled in the HTML file directly, but if you need to modify the React component:
const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      {/* Table content would go here */}
    </table>
  </main>
);