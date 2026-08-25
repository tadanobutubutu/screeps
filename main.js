// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope attribute to th elements

import React from 'react';
import ReactDOM from 'react-dom/client';

// Sample data table with accessible th elements
const data = [
  { id: 1, name: 'Item 1', value: 'Value 1' },
  { id: 2, name: 'Item 2', value: 'Value 2' }
];

function App() {
  return (
    <div className="app">
      {/* Landmark: Using <main> for main content */}
      <main role="main" aria-labelledby="main-heading">
        <h1 id="main-heading">Accessible Application</h1>
        
        {/* SVG with accessible name (REACT_041) */}
        <svg 
          aria-label="Close menu icon" 
          role="img" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
        >
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
        
        {/* Accessible table with scope attributes (REACT_027) */}
        <table>
          <caption>Data Table</caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.name}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* SVG icon with accessible name (REACT_041) */}
        <svg 
          aria-label="Settings gear icon" 
          role="img" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
        >
          <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
        
        {/* Fixed fake link - using proper <button> instead of <a> without href (REACT_036) */}
        <button 
          type="button" 
          onClick={() => console.log('Action clicked')}
          aria-label="Perform action"
        >
          Click Here
        </button>
        
        {/* Example of unique landmark (REACT_025) */}
        <nav aria-label="Primary navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
        
        {/* Example of unique landmark for footer (REACT_025) */}
        <footer role="contentinfo">
          <nav aria-label="Footer navigation">
            <p>Footer content</p>
          </nav>
        </footer>
      </main>
    </div>
  );
}

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export for testing
export default App;