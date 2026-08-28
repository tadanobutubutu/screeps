import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    // REACT_015: Add lang attribute to HTML element
    <html lang="en">
      
      <head>
        <meta charset="UTF-8" />
        <title>Screeps Main</title>
      </head>
      
      <body>
        {/* REACT_017: Add/fix 4 landmark issues - header, nav, main, aside, footer */}
        <header role="banner">
          <h1>Welcome to Screeps</h1>
        </header>
        
        <nav role="navigation" aria-label="Primary navigation">
          <ul>
            <li><a href="/" id="home-link">Home</a></li>
            <li><a href="/insights" id="insights-link">Insights</a></li>
            <li><a href="/settings" id="settings-link">Settings</a></li>
          </ul>
        </nav>
        
        <main role="main">
          <div>Main content area</div>
        </main>
        
        <aside role="complementary">
          <p>Sidebar content</p>
        </aside>
        
        <footer role="contentinfo">
          <p>&copy; 2026 Screeps</p>
        </footer>
      </body>
    </html>
  );
};

export default App;