import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';
import { getUserData } from '../lib/db';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData } from '../store/actions/dashboardActions';
import { RootState } from '../store/reducers';
import { DashboardHeader } from './DashboardHeader';
import { DashboardFooter } from './DashboardFooter';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardContent } from './DashboardContent';
import { DashboardStats } from './DashboardStats';
import { DashboardCharts } from './DashboardCharts';
import { DashboardActions } from './DashboardActions';

interface DashboardProps {
  initialUserData?: UserData | DashboardData;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialUserData }) => {
  const [userData, setUserData] = useState<UserData | null>(initialUserData || null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(initialUserData || null);
  const [loading, setLoading] = useState<boolean>(!initialUserData);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const userDataRes = await getUserData(session.user.email);
        setUserData(userDataRes);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    const fetchDashboardData = async () => {
      if (!session) {
        return;
      }

      try {
        dispatch(fetchDashboardData());
        setDashboardData(state.dashboard.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    if (!initialUserData) {
      fetchUserData();
      fetchDashboardData();
    }
  }, [session, initialUserData]);

  useEffect(() => {
    if (dashboardData) {
      setLoading(false);
    }
  }, [dispatch, dashboardData]);

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

  if (!userData && !dashboardData) {
    return (
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <ErrorDisplay message="No user data available" />
        </div>
        <DashboardFooter />
    );
  } else if (userData) {
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
  } else {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <nav>
            <button
              onClick={() => setActiveTab('stats')}
              className={activeTab === 'stats' ? 'active' : ''}
            >
              Stats
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={activeTab === 'charts' ? 'active' : ''}
            >
              Charts
            </button>
          </nav>
        </header>

        <main className="dashboard-main">
          {activeTab === 'stats' && <DashboardStats data={dashboardData} />}
          {activeTab === 'charts' && <DashboardCharts data={dashboardData} />}
        </main>

        <DashboardActions data={dashboardData} />
      </div>
    );
  }
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