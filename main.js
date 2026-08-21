// Assuming the main.js file is a React component that renders the HTML document
import React from 'react';

function App() {
  // Example content that fixes accessibility issues
  const content = [
    { id: 1, name: 'Item 1', description: 'Description 1' },
    { id: 2, name: 'Item 2', description: 'Description 2' },
  ];

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        {/* Use proper landmarks */}
        <main>
          <h1>Content</h1>
          
          {/* Fix REACT_036: Use real anchor tags instead of fake links */}
          <a href="/about">About Us</a>
          <a href="/contact">Contact Page</a>
          
          {/* Fix REACT_027: Proper table structure with th */}
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {content.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Fix REACT_041: SVG with accessible name */}
          <svg role="img" aria-label="Search icon" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" fill="currentColor" />
          </svg>
          
          {/* Fix REACT_041: Another SVG with accessible name */}
          <svg role="img" aria-labelledby="menu-title" width="24" height="24" viewBox="0 0 24 24">
            <title id="menu-title">Menu</title>
            <rect x="3" y="6" width="18" height="2" fill="currentColor" />
            <rect x="3" y="11" width="18" height="2" fill="currentColor" />
            <rect x="3" y="16" width="18" height="2" fill="currentColor" />
          </svg>
        </main>
      </body>
    </html>
  );
}

export default App;