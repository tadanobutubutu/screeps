// pages/main.js
import Head from 'next/head';

export default function MainPage() {
  return (
    <>
      <Head>
        {/* REACT_015 Fix: Add lang attribute to html element */}
        <html lang="en" />
      </Head>
      
      <div className="app-container">
        {/* REACT_017 & REACT_025 Fix: Proper landmark usage, unique landmarks */}
        <header role="banner" className="site-header">
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main id="main-content">
          <h1>Welcome to Our Application</h1>
          
          {/* REACT_036 Fix: Use proper anchor tag instead of div/button for links */}
          <p>
            Please <a href="/login">sign in</a> to continue.
          </p>
          
          {/* REACT_027 Fix: Proper table structure with caption, thead, tbody, and th scope */}
          <table>
            <caption>User Statistics</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice Johnson</td>
                <td>Developer</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>Bob Smith</td>
                <td>Designer</td>
                <td>Active</td>
              </tr>
              <tr>
                <td>Carol Williams</td>
                <td>Manager</td>
                <td>Inactive</td>
              </tr>
            </tbody>
          </table>

          {/* REACT_041 Fix: SVG with accessible name */}
          <div className="chart-section">
            <h2>Analytics Chart</h2>
            <svg 
              role="img" 
              aria-label="Bar chart showing monthly analytics data" 
              width="400" 
              height="200" 
              viewBox="0 0 400 200"
              className="chart"
            >
              <title>Analytics Chart</title>
              <rect x="50" y="100" width="40" height="80" fill="#4CAF50" />
              <rect x="120" y="60" width="40" height="120" fill="#2196F3" />
              <rect x="190" y="80" width="40" height="100" fill="#FF9800" />
              <rect x="260" y="40" width="40" height="140" fill="#E91E63" />
            </svg>
          </div>

          {/* Additional icon SVGs with accessible names */}
          <div className="icon-buttons">
            <button type="button" aria-label="Edit document">
              <svg 
                role="img" 
                aria-label="Edit icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button type="button" aria-label="Delete item">
              <svg 
                role="img" 
                aria-label="Delete icon" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </main>

        <footer role="contentinfo" className="site-footer">
          <nav aria-label="Footer navigation">
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </nav>
        </footer>
      </div>

      <style jsx>{`
        .app-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .site-header {
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .site-header ul {
          list-style: none;
          padding: 0;
          display: flex;
          gap: 20px;
        }
        .site-header a {
          text-decoration: none;
          color: #0070f3;
        }
        .site-header a:hover {
          text-decoration: underline;
        }
        main {
          padding: 40px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
        caption {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .chart-section {
          margin: 40px 0;
        }
        .icon-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        .icon-buttons button {
          background: none;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px;
          cursor: pointer;
        }
        .icon-buttons button:hover {
          background-color: #f5f5f5;
        }
        .site-footer {
          padding: 20px 0;
          border-top: 1px solid #eee;
          margin-top: 40px;
        }
        .site-footer ul {
          list-style: none;
          padding: 0;
          display: flex;
          gap: 20px;
        }
        .site-footer a {
          color: #666;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}