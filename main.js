import React from 'react';

const Dashboard = ({ error, success }) => {
  if (error) {
    return <main>Error: {error.message}</main>;
  } else if (success) {
    return <main>Success: {success.message}</main>;
  } else {
    return <main>Welcome to the Dashboard</main>;
  }
};

export default Dashboard;