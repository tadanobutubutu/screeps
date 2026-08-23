import React from 'react';
import Head from 'next/head';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

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

// New function to fix table structure issues (REACT_027)
export const fixTableStructureIssues = (tableData) => {
  if (!Array.isArray(tableData) || !tableData[0] || typeof tableData[0] !== 'object' || !tableData[0].hasOwnProperty('Header') || !tableData[0].hasOwnProperty('accessor')) {
    throw new Error('Invalid table data structure');
  }
  return tableData;
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

// Main component
export default function Home({ projects }) {
  // Define the columns for the table
  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Updated', accessor: 'updated' },
  ];

  return (
    <div lang="en">
      <Head>
        <title>Project Manager</title>
      </Head>
      
      <header role="banner">
        <h1>Accessibility Fixed Page</h1>
      </header>

      <main>
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        <section>
          <h2>Project List</h2>
            
          <table>
            <caption>Project List</caption>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.Header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects && projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.status}</td>
                  <td>{project.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 id="icons-heading">Accessible Icons</h2>
          <div className="icons-container">
            <createAccessibleSVG iconName="Settings" />
            <createAccessibleSVG iconName="Home" />
          </div>
        </section>
      </main>

      <footer role="contentinfo">
        <p>&copy; 2024 Project Manager</p>
      </footer>
    </div>
  );
}