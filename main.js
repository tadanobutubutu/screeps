import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <main role="main">
      <div className="app-container">
        {/* Existing App content */}
        {/* Example of adding scope attribute to a <th> element */}
        <table>
          <thead>
            <tr>
              <th scope="col"><div>src/constants.js</div></th>
              <th scope="col"><div>src/managers/roomManager.js</div></th>
              <th scope="col"><div>src/managers/spawnManager.js</div></th>
              <th scope="col"><div>src/managers/towerManager.js</div></th>
              {/* ... other headers ... */}
            </tr>
          </thead>
          <tbody>
            {/* ... table rows ... */}
          </tbody>
        </table>
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