// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <main>
      <div>
        {/* Primary content goes here */}
      </div>
    </main>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
}