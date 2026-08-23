import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraphComponent from './components/DependencyGraphComponent';
import IndexComponent from './components/IndexComponent';

export default DependencyGraphComponent;
export default IndexComponent;

function App() {
  return (
    <div>
      <Dashboard />
      <DependencyGraphComponent />
      <IndexComponent />
    </div>
  );
}

function Dashboard({ isLoading, error, data }) {
  return (
    <main>
      {isLoading && (
        <section>
          <p>Loading...</p>
        </section>
      )}
      {error && (
        <section>
          <p>Error: {error.message}</p>
        </section>
      )}
      {data && !isLoading && !error && (
        <section>
          {/* Main content here */}
          <h1>Dashboard</h1>
          <p>Dashboard content</p>
        </section>
      )}
    </main>
  );
}

function DashboardContent({ isLoading, error, data }) {
  return (
    <>
      {isLoading && (
        <section>
          <p>Loading...</p>
        </section>
      )}
      {error && (
        <section>
          <p>Error: {error.message}</p>
        </section>
      )}
      {data && !isLoading && !error && (
        <section>
          {/* Main content here */}
          <h1>Dashboard</h1>
          <p>Dashboard content</p>
        </section>
      )}
    </>
  );
}

// Main entry point for the Screeps bot repository
ReactDOM.render(<App />, document.getElementById('root'));