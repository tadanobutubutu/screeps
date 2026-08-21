// main.js
export { default as Dashboard } from './components/Dashboard';

// Other exports preserved from original main.js
export { App } from './App';
export { Header } from './components/Header';
export { Footer } from './components/Footer';

// Dashboard component implementation with REACT_025 fix
// Changed one <main> to <section> to ensure only one landmark exists
const Dashboard = () => {
  const [state, setState] = React.useState('success');

  const handleError = () => {
    setState('error');
  };

  const handleSuccess = () => {
    setState('success');
  };

  if (state === 'error') {
    return (
      <div className="dashboard-container">
        <main>
          <h2>Error State</h2>
          <p>An error occurred during processing.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <section>
        <h2>Success State</h2>
        <p>Operation completed successfully.</p>
      </section>
    </div>
  );
};

export default Dashboard;