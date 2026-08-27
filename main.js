// main.js - Updated with proper React landmarks for accessibility

import React from 'react';

// Assuming this is a React component that renders the main page structure
const MainPage = () => {
  return (
    <html lang="en">
      <head>
        <title>Dashboard</title>
      </head>
      <body>
        <header>
          <h1>Header Content</h1>
        </header>
        
        <nav aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
        
        <main>
          <div id="table-rotated">
            {/* Primary content - table data */}
          </div>
        </main>
        
        <footer>
          <p>&copy; 2024</p>
        </footer>
      </body>
    </html>
  );
};

export default MainPage;