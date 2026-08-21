import React from 'react';
import ReactDOM from 'react-dom/client';

if (typeof document !== 'undefined') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.lang = 'en';
  }
}

const App = () => {
  // Integrating both changes to include the new data row for Charlie
  return (
    <div id="root" lang="en" role="main">
      <header role="banner">
        <h1>User Data</h1>
      </header>
      <main id="main-content">
        <p id="description">This is a demo application.</p>
        <table id="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th scope="col">Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice</td>
              <td>30</td>
            </tr>
            <tr>
              <td>Bob</td>
              <td>25</td>
            </tr>
            // Adding Charlie's row from the conflicting code
            <tr>
              <td>Charlie</td>
              <td>40</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

// Keeping both export statements to maintain the original export and the line added in the conflicting code
export default App;

// Integrating both rendering approaches
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);