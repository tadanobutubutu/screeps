import React from 'react';

const Dashboard = ({ error, data }) => {
  if (error) {
    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        <main>
          <section className="error-section">
            <h2>Error</h2>
            <p>{error.message}</p>
          </section>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        <main>
          <section className="loading-section">
            <h2>Loading...</h2>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <main>
        <section className="data-section">
          <h2>Data Overview</h2>
          {/* Render your data here */}
          <div className="dependency-dashboard">
            <h3>Dependency Dashboard</h3>
            <p>View the <a href="https://docs.renovatebot.com/key-concepts/dashboard/" target="_blank" rel="noopener noreferrer">Dependency Dashboard documentation</a> to learn more.</p>
            <p>Repository problems: <a href="https://developer.mend.io//github/tadanobutubutu/screeps" target="_blank" rel="noopener noreferrer">View logs</a></p>
            <p>Mend.io Web Portal: <a href="https://developer.mend.io/github/tadanobutubutu/screeps" target="_blank" rel="noopener noreferrer">View repository</a></p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;