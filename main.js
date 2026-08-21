import React from 'react';
import Head from 'next/head';

// Utility functions
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function validateProject(project) {
  if (!project.name || typeof project.name !== 'string') {
    return { valid: false, error: 'Project name is required' };
  }
  if (!project.status || !['Active', 'Pending', 'Completed'].includes(project.status)) {
    return { valid: false, error: 'Invalid project status' };
  }
  return { valid: true };
}

export const PROJECT_STATUSES = ['Active', 'Pending', 'Completed', 'Archived'];

// Main component combining both versions' features
const Home = ({ projects }) => {
  const [error, setError] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [errCopyHover, setErrCopyHover] = React.useState(false);
  const [errRetryHover, setErrRetryHover] = React.useState(false);

  const copyErr = () => {
    // Implementation to copy error
    setCopied(true);
  };

  const fetchStats = (force) => {
    // Implementation to fetch stats
    setRefreshing(true);
  };

  const renderContent = () => {
    if (error) {
      return (
        <main>
          <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
          <pre
            tabIndex={0}
            aria-label="エラーメッセージ詳細"
            style={{
              color: '#c53030',
              backgroundColor: '#fff5f5',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto',
            }}
          >
            {error}
          </pre>
          {/* Other error-related elements */}
        </main>
      );
    } else {
      return (
        <main>
          {/* Project list from origin version */}
          <table>
            <caption>Project List</caption>
            <thead>
              <tr>
                <th scope="col">Project Name</th>
                <th scope="col">Status</th>
                <th scope="col">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.status}</td>
                  <td>{project.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Error display alongside table when error exists */}
          {error && (
            <main>
              <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
              <pre
                tabIndex={0}
                aria-label="エラーメッセージ詳細"
                style={{
                  color: '#c53030',
                  backgroundColor: '#fff5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                }}
              >
                {error}
              </pre>
            </main>
          )}

          {/* Additional visual states from HEAD version */}
          {errCopyHover && (
            <div style={{ color: '#ffebee' }}>Copy hover effect active</div>
          )}
          {errRetryHover && (
            <div style={{ color: '#ffebee' }}>Retry hover effect active</div>
          )}

          {/* Refresh trigger */}
          <button onClick={fetchStats} disabled={refreshing}>
            Refresh Stats
          </button>
        </main>
      );
    }
  };

  return (
    <>
      <Head>
        {/* Accessibility improvement note */}
      </Head>

      <div lang="en">
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>

        <main role="main" id="main-content">
          <h1>Projects</h1>

          {/* Successful state content area */}
          {!error && (
            <div>
              {/* Placeholder for successful project display */}
              <p>All systems operational.</p>
            </div>
          )}

          {/* Table displaying projects */}
          <table>
            <caption>Project List</caption>
            <thead>
              <tr>
                <th scope="col">Project Name</th>
                <th scope="col">Status</th>
                <th scope="col">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.status}</td>
                  <td>{project.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Error handling section */}
          {error && (
            <main>
              <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
              <pre
                tabIndex={0}
                aria-label="エラーメッセージ詳細"
                style={{
                  color: '#c53030',
                  backgroundColor: '#fff5f5',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                }}
              >
                {error}
              </pre>
            </main>
          )}

          {/* Visual feedback states */}
          {errCopyHover && (
            <div style={{ color: '#ffebee' }}>Copy hover effect active</div>
          )}
          {errRetryHover && (
            <div style={{ color: '#ffebee' }}>Retry hover effect active</div>
          )}

          {/* Fetch stats button */}
          <button onClick={fetchStats} disabled={refreshing}>
            Refresh Stats
          </button>
        </main>

        <footer role="contentinfo">
          <p>© 2024 Company Name</p>
        </footer>

        {/* SVG icons with accessibility */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          aria-labelledby="icon-title" 
          role="img"
        >
          <title id="icon-title">Settings icon</title>
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z" />
        </svg>

        {/* Alternative simple SVG */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          aria-label="Home" 
          role="img"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      </div>
    </>
  );
};

export default Home;