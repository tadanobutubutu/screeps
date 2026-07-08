import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { AnimatedCard, EmptyMessage } from '../../components';
import { fetchData } from '../../services/api';

type DashboardProps = {
  userId: string;
};

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData(userId);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (loading) {
    return (
      <ActivityIndicator
        testID="dashboard-loading"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        color="#2e86de"
      />
    );
  }

  if (error) {
    return <EmptyMessage message={`Error: ${error}`} />;
  }

  if (!data.length) {
    return <EmptyMessage message="No data available." />;
  }

  return (
    <AnimatedCard
      testID="dashboard-card"
      style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        padding: 15,
      }}
    >
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <h3 style={{ margin: 0 }}>{item.title}</h3>
          <p style={{ margin: '5px 0 0 0' }}>{item.description}</p>
        </React.Fragment>
      ))}
    </AnimatedCard>
  );
};

export default Dashboard;
