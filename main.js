import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getUserData } from '../lib/api';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';
import { DashboardFooter } from './DashboardFooter';
import { LoadingSpinner } from './LoadingSpinner';

export const Dashboard = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          const data = await getUserData(session.user.email);
          setUserData(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchData();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [session, status, router]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-grow p-4">
        <DashboardContent userData={userData} />
      </main>
      <DashboardFooter />
    </div>
  );
};