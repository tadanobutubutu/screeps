// main.js
// Fixed REACT_017: Added <main> landmark for primary content accessibility

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Initialize React app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Utility function for landmark management
export const getMainContent = (content) => {
  return content;
};

// App component with proper landmark structure
function App() {
  return (
    <div className="app">
      <header>
        <h1>Application Title</h1>
        <nav>
          {/* Navigation content */}
        </nav>
      </header>
      
      {/* 
        REACT_017 Fix: Primary content wrapped in <main> landmark
        This allows keyboard and screen reader users to skip directly 
        to the main content area
      */}
      <main id="main-content" role="main">
        <table id="table-rotated">
          {/* Table content */}
        </table>
      </main>
      
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;