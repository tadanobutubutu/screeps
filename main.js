import React from 'react';
import Head from 'next/head';
import { createAccessibleSVG } from './createAccessibleSVG';

// Helper to dynamically import the compiled main.js module
const loadMainModule = () => import('../dist/main.js').then(m => m.default);

// Main component with accessibility fixes and table integration
export default async function Home({ /* props may be passed */ }) {
  // Prepare column definitions for the analysis table
  const columns = [
    // ...other columns (total of 26) would be defined here
    {
      Header: 'dist/main.js',
      accessor: 'runMain',
      role: 'presentation'
    },
  ];

  // Load the main module export lazily to avoid bundler issues
  const distMainResult = await loadMainModule();

  // Enhance the loaded module with required accessibility attributes
  distMainResult.ariaLabel = 'Main component';

  // Build the analysis table structure
  const table = (
    <table aria-label="Code analysis results">
      <thead>
        <tr>
          <th role="presentation">{columns[columns.length - 1].Header}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td role="presentation">{distMainResult || ''}</td>
        </tr>
      </tbody>
    </table>
  );

  // Accessible SVG landmark for the table
  const landmarkTable = createAccessibleSVG('Code analysis results', '0 0 1 1');

  // Accessible navigation and header
  return (
    <>
      <Head>
        {/* Lang attribute should be set in _document.js */}
      </Head>

      <div>
        <header role="banner">
          <nav role="navigation" aria-label="Main navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/projects">Projects</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>

        {/* Render the SVG landmark */}
        {landmarkTable}

        {/* Render the analysis table */}
        {table}

        {/* Example link to a destination with proper ARIA label */}
        const linkContent = 'Link to destination';
        const link = (
          <a href="#" aria-label="Navigate to destination">
            {linkContent}
          </a>
        );

        {link}
      </div>
    </>
  );
}

// Export the helper function for creating accessible SVG icons
export const createAccessibleSVG = (iconName, viewBox = "0 0 24 24") => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    aria-label={`${iconName} icon`}
    role="img"
    className="icon"
  >
    <title>{iconName}</title>
    <circle cx="12" cy="12" r="10" fill="currentColor" />
  </svg>
);

// Preserve existing utility functions and constants from the original repo
export async function getStaticProps() {
  // Placeholder for static data fetching; integrate with your data source
  return {
    props: {
      // Sample data structure; replace with actual projects data
      projects: [
        { id: 1, name: 'Project Alpha', status: 'Active', updated: '2024-01-15' },
        { id: 2, name: 'Project Beta', status: 'Pending', updated: '2024-01-10' },
      ],
    },
  };
}

// Utility functions for date formatting and project validation
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
export const PROJECT_STATUSES = ['Active', 'Pending', 'Completed', 'Archived'];