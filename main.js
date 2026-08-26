import React from 'react';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Accessible React App</title>
      </head>
      <body>
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <a href="/home" role="link">Home</a>
            <a href="/about" role="link">About</a>
          </nav>
        </header>
        
        <main role="main">
          <h1>Welcome to Our Accessible Application</h1>
          
          <section role="region" aria-labelledby="section-heading">
            <h2 id="section-heading">Important Information</h2>
            <p>This section contains important details about our services.</p>
            
            <table role="table" aria-label="Data summary">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Item 1</td>
                  <td>100</td>
                </tr>
                <tr>
                  <td>Item 2</td>
                  <td>200</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          <section role="region" aria-labelledby="details-heading">
            <h2 id="details-heading">Additional Details</h2>
            <p>More information about our application.</p>
          </section>
        </main>
        
        <footer role="contentinfo">
          <p>&copy; 2024 Our Company. All rights reserved.</p>
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            aria-hidden="false"
            aria-label="Information icon"
            role="img"
          >
            <circle cx="12" cy="12" r="10" fill="#4A90E2" />
            <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12">i</text>
          </svg>
        </footer>
      </body>
    </html>
  );
}

export default App;