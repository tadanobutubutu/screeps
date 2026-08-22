import React from 'react';
import Head from 'next/head';

// Example component showing proper accessibility patterns
export default function Home({ projects }) {
  return (
    <>
      <Head>
        {/* Fix: Add proper lang attribute at the document level */}
        {/* This is typically done in _document.js or _app.js for Next.js */}
      </Head>
      
      <div lang="en"> {/* Fix: REACT_015 - Add language attribute */}
        {/* Fix: REACT_017/REACT_025 - Use proper landmark elements */}
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
          
          {/* Example of proper table structure - Fix: REACT_027 */}
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

          {/* Fix: REACT_036 - Use real anchor tags instead of clickable divs */}
          <a href="/projects/new" className="button">
            Create New Project
          </a>
          
          {/* Or if it's not a navigation link, use a button: */}
          <button type="button" onClick={() => handleAction()}>
            Perform Action
          </button>
        </main>

        <footer role="contentinfo">
          <p>© 2024 Company Name</p>
        </footer>

        {/* Fix: REACT_041 - Add accessible names to SVGs */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          aria-labelledby="icon-title" 
          role="img"
        >
          <title id="icon-title">Settings icon</title>
          <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c.12-.22.07-.49-.12-.64l-2.11-1.66z" />
        </svg>

        {/* Alternative: Simple SVG with aria-label */}
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
}

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