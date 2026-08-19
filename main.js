import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getDashboardData } from '../lib/api';
import { DashboardData } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getDashboardData(session.user.id);
        setData(result);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <section className="text-center">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <section className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Dashboard content */}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;