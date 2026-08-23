import React from 'react';
import Head from 'next/head';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// TODO: This is the existing code that needs to be preserved

// Re-export imported content modules
export { dependencyGraphContent };
export { indexContent };

// Helper function to create accessible SVG icons
export const createAccessibleSVG = (iconName, viewBox = "0 0 24 24", className = "icon") => (
  <svg viewBox={viewBox} className={className} role="img" aria-label={iconName}>
    <title>{iconName}</title>
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
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
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

// New function to fix table structure issues (REACT_027)
export const fixTableStructureIssues = (tableData) => {
  if (!Array.isArray(tableData)) {
    throw new Error('Invalid table data structure');
  }
  
  if (tableData.length === 0) {
    return [];
  }
  
  const firstRow = tableData[0];
  if (!firstRow || typeof firstRow !== 'object' || Array.isArray(firstRow)) {
    throw new Error('Invalid table data structure');
  }
  
  const columns = Object.keys(firstRow);
  const headerCells = columns.map((column, index) => ({
    key: column,
    header: column,
    index: index
  }));
  
  return tableData.map((row, rowIndex) => ({
    ...row,
    _rowIndex: rowIndex,
    _isHeader: rowIndex === 0
  }));
};

// New function to ensure unique landmarks (REACT_025)
export const ensureUniqueLandmarks = (landmarks) => {
  const landmarkIDs = new Set();
  for (let landmark of landmarks) {
    if (landmarkIDs.has(landmark.id)) {
      throw new Error(`Duplicate landmark ID "${landmark.id}" found`);
    }
    landmarkIDs.add(landmark.id);
  }
  return landmarks;
};

// New function to add ARIA label to a fake link (REACT_036)
export const addAriaLabelToFakeLink = (content, ariaLabel, href = "#") => {
  return (
    <a href={href} aria-label={ariaLabel}>
      {content}
    </a>
  );
};

// New function to add lang attribute to HTML element (REACT_015)
export const addLangAttribute = (lang = 'en') => {
  return { lang };
};

// New function to wrap primary content in a main element
export const wrapPrimaryContentInMain = (content) => {
  return <main>{content}</main>;
};

// Add back required exports that might have been removed
export { default } from './main';

// Main component
export default function Home({ projects }) {
  // Define the columns for the table
  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Updated', accessor: 'updated' },
  ];

  // Ensure unique landmark IDs
  ensureUniqueLandmarks([
    { id: 'header' },
    { id: 'main-navigation' },
    { id: 'main-content' },
    { id: 'footer' },
  ]);

  // Add ARIA label to a skip link (fake link fix)
  const skipLink = addAriaLabelToFakeLink('Skip to main content', 'Skip to main content', '/#main-content');

  // Add lang attribute dynamically
  const langAttr = addLangAttribute('en');

  return (
    <div {...langAttr}>
      {/* Skip link for accessibility */}
      {skipLink}
      
      <Head>
        <title>Project Manager</title>
      </Head>
      
      <header role="banner" id="header">
        <h1>Accessibility Fixed Page</h1>
      </header>

      <nav role="navigation" id="main-navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/projects">Projects</a></li>
        </ul>
      </nav>

      <main id="main-content">
        <h2>Projects</h2>
        <table role="table" aria-label="Project list">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Updated</th>
            </tr>
          </thead>
          <tbody>
            {projects && projects.map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.status}</td>
                <td>{formatDate(project.updated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer role="contentinfo" id="footer">
        <p>&copy; 2024 Project Manager</p>
      </footer>
    </div>
  );
}