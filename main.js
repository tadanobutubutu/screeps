import React, { useState, useEffect, useRouter } from 'react';
import { useAuth, Html, Head, Main, NextScript } from 'next/document';
import { getDashboardData, DashboardData } from '../lib/api';

// Import React from the first branch, but keep the rest of the functionalities and imports from the second branch

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
        const result = await getDashboardData(user.id);
        setData(result);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  // Keep the loading content and loading styles from the first branch
  if (loading) {
    return (
      <Html lang="en">
        <Head>
          {/* Add aria-label or title element to make SVG accessible */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" aria-label="Website icon" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div className="dashboard min-h-screen">
            <header>
              <h1>Dashboard</h1>
            </header>
            <main>
              <section className="loading-section flex items-center justify-center min-h-[60vh]">
                <p>Loading dashboard...</p>
              </section>
            </main>
          </div>
        </body>
      </Html>
    );
  }

  if (error) {
    return (
      <Html lang="en">
        <Head>
          {/* Add aria-label or title element to make SVG accessible */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" aria-label="Website icon" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div className="dashboard min-h-screen">
            <header>
              <h1>Dashboard</h1>
            </header>
            <main>
              <section className="error-section flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Error</h2>
                  <p>{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              </section>
            </main>
          </div>
        </body>
      </Html>
    );
  }

  // Keep the rendered dashboard content and styles from the second branch
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
        <div className="dashboard min-h-screen">
          <header className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </header>
          <main className="container mx-auto px-4 py-8">
            <section className="data-section">
              <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
              {data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dashboard content would go here */}
                </div>
              )}
            </section>
          </main>
        </div>
      </body>
    </Html>
  );
};

export { Dashboard };