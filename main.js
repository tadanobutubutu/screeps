Looking at this conflict, I can see two distinct and unrelated pieces of functionality:

1. HEAD contains a complete `Dashboard` component using React/Next.js with authentication, data fetching, and proper loading/error states.
2. `origin/main` contains a standard React app entry point that initializes the React root and renders the `App` component, plus an exported utility function `wrapWithMain`.

These are different files merged into the same name by mistake. The most logical resolution is to preserve both functionalities by combining them into a single logical file - keeping the app entry point from `origin/main` and incorporating the Dashboard component from HEAD as a separate, meaningful addition.

I'll resolve this by keeping the entry point and root rendering logic from `origin/main`, and integrating the `Dashboard` component from `HEAD` as an exported component that can be used within the app:

```js
// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import DashboardContent from './DashboardContent';

// Existing code (preserved as-is)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Dashboard component with authentication and data fetching
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

  return (
    <main className="container mx-auto px-4 py-8">
      <DashboardContent data={data} />
    </main>
  );
};

// New function to wrap content in main landmark
function wrapWithMain(content) {
  return <main>{content}</main>;
}

// Export all existing functions and add new ones
export { wrapWithMain, Dashboard };
// Keep all other existing exports
```