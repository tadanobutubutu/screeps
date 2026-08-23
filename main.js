import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <main role="main">
      <div className="app-container">
        {/* Existing App content */}
      </div>
    </main>
  );
}

// Set language attribute on the HTML element
document.documentElement.setAttribute('lang', 'en');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export App component
export default App;