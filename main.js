// Main component
import React from 'react';
import Head from 'next/head';

// Example component showing proper accessibility patterns
export default function Home({ projects }) {
  // Define the columns for the table (26 columns total)
  const columns = [
    { Header: 'src/constants.js' },
    // ... (additional columns up to 26 total)
    {
      Header: 'dist/main.js',
      accessor: 'distMain', // Add this accessor for the required export
    },
  ];

  // New function to include the required export from the main.js dist file
  const distMain = async () => {
    const mainModule = await ... // Import the dist file
    return mainModule.default; // Return the default export
  };

  // Use the distMain function in your table data
  const tableData = await Promise.all(columns.map(column => column.accessor ? distMain().then(main => main[column.accessor]) : null));

  // Helper function to create accessible SVG icons
  const createAccessibleSVG = (iconName, viewBox = "0 0 24 24") => (
    <svg
      viewBox={viewBox}
      aria-labelledby={`svg-title-${iconName.replace(/\s+/g, '-').toLowerCase()}`}
      role="img"
      className="icon"
    >
      <title id={`svg-title-${iconName.replace(/\s+/g, '-').toLowerCase()}`}>{iconName}</title>
      {/* SVG content */}
    </svg>
  );

  return (
    <>
      <Head>
        {/* Note: lang attribute should be set in _document.js or _app.js at the html element level */}
        {/* <html lang="en"> should be in your _document.js file */}
      </Head>
      
      <div>
        {/* Fix: REACT_017/REACT_025 - Use proper landmark elements */}
        <header role="banner" aria-label="Site header">
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a ...</a></li>
            </ul>
          </nav>
        </header>

        {/* Fix landmark issues (REACT_017) - ensure proper landmark structure */}
        <main id="main-content" aria-label="Main content">
          <h1>Projects</h1>
          
          {/* Fix table structure issues (REACT_027) - single tbody only */}
          <table aria-label="Code analysis results">
            <caption>Project List</caption>
            <thead>
              <tr>
                {columns.map(({ Header: category }, idx) => (
                  <th key={idx} scope="col">{category}</th>
                ))}
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
              {/* Data row for distMain export */}
              <tr>
                {columns.map(({ Header: category }, idx) => (
                  <td key={idx}>{category === 'dist/main.js' ? distMain || '' : ''}</td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Fix fake link issue (REACT_036) - use proper anchor or button */}
          {/* If links are styled divs/spans, replace with: */}
          <a href="/projects/new" className="button" aria-label="Navigate to create new project">
            {/* link content */}
          </a>
          
          {/* OR if it's a button action: */}
          <button type="button" aria-label="Perform action" onClick={() => handleAction()}>
            {/* button content */}
          </button>

          {/* Add accessible names to SVGs (REACT_041) */}
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
          >
            <title>External Link</title>
            <path d="M..." />
          </svg>
          
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            role="img"
            className="info-icon"
          >
            <title>Information</title>
            <circle cx="12" cy="12" r="10" />
          </svg>

          {/* Simple SVG with aria-labelledby */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            aria-labelledby="icon-title-settings" 
            role="img"
          >
            <title id="icon-title-settings">Settings icon</title>
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-.97l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.08-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.66c-.04.32-.07.65-.07.97 0 .33.03.66.07.97l-2.11 1.66c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.98l2.49 1c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
          </svg>

          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            aria-labelledby="icon-title-home" 
            role="img"
          >
            <title id="icon-title-home">Home</title>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </main>

        {/* Footer with proper landmark */}
        <footer role="contentinfo" aria-label="Site footer">
          <p>© 2024 Company Name</p>
        </footer>
      </div>
    </>
  );
}

// Helper function to create accessible SVG icons
export const createAccessibleSVG = (iconName, viewBox = "0 0 24 24") => (
  <svg
    viewBox={viewBox}
    aria-labelledby={`svg-title-${iconName.replace(/\s+/g, '-').toLowerCase()}`}
    role="img"
    className="icon"
  >
    <title id={`svg-title-${iconName.replace(/\s+/g, '-').toLowerCase()}`}>{iconName}</title>
    {/* SVG content */}
  </svg>
);

// Helper function to export projects data
export async function getStaticProps() {
  return {
    props: {
      projects: [
        { id: 1, name: 'Project Alpha', status: 'Active', updated: '2024-01-15' },
        { id: 2, name: 'Project Beta', status: 'Pending', updated: '2024-01-10' },
      ],
    },
  };
}

// Preserve any existing utility functions
export function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function validateProject(project) {
  if (!project.name || typeof project.name !== 'string') {
    return { valid: false, error: 'Project name is required' };
  }
  if (!project.status || !['Active', 'Pending', 'Completed', 'Archived'].includes(project.status)) {
    return { valid: false, error: 'Invalid project status' };
  }
  return { valid: true };
}

// Existing export that must be preserved
export const PROJECT_STATUSES = ['Active', 'Pending', 'Completed', 'Archived'];