import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { getUserData } from '../lib/db';
import { UserData } from '../types/user';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardContent } from './DashboardContent';
import { DashboardFooter } from './DashboardFooter';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

interface DashboardProps {
  initialUserData?: UserData;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialUserData }) => {
  const [userData, setUserData] = useState<UserData | null>(initialUserData || null);
  const [loading, setLoading] = useState<boolean>(!initialUserData);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const data = await getUserData(session.user.email);
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    if (!initialUserData) {
      fetchUserData();
    }
  }, [session, initialUserData]);

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
        <div className="flex-1 flex items-center justify-center">
          <ErrorDisplay message={error} />
        </div>
        <DashboardFooter />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <ErrorDisplay message="No user data available" />
        </div>
        <DashboardFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <DashboardSidebar userData={userData} />
        <main className="flex-1 p-4 overflow-auto">
          <DashboardContent userData={userData} />
        </main>
      </div>
      <DashboardFooter />
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const userData = await getUserData(session.user?.email);
    return {
      props: {
        initialUserData: userData,
      },
    };
  } catch (error) {
    return {
      props: {
        initialUserData: null,
      },
    };
  }
}