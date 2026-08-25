import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Assuming there are React components for `dependency-graph.html` and `index.html`
import DependencyGraphPage from './components/DependencyGraphPage';
import HomePage from './components/HomePage';

function App() {
  return (
    <div>
      <main>
        <HomePage />
      </main>
      <main>
        <DependencyGraphPage />
      </main>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);