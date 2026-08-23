import React from 'react';
import { Component, ReactDOMServer } from 'react';
import { HTMLAttributes, ReactElement } from 'react';

import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Utility functions
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

export const addAriaLabelToFakeLink = (content, ariaLabel, href = "#") => (
  <a href={href} aria-label={ariaLabel}>
    {content}
  </a>
);

export const addLangAttribute = (lang = 'en') => ({ lang });

export const wrapPrimaryContentInMain = (content) => <main>{content}</main>;

// Main functional component
export default function Home({ projects }) {
  // Ensure unique landmark IDs
  ensureUniqueLandmarks([
    { id: 'header' },
    { id: 'main-navigation' },
    { id: 'main-content' },
    { id: 'footer' },
  ]);

  // Add ARIA label to skip link
  const skipLink = addAriaLabelToFakeLink('Skip to main content', 'Skip to main content', '/#main-content');

  // Table columns
  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Updated', accessor: 'updated' },
  ];

  // Render table using utility function if needed
  // const tableData = fixTableStructureIssues(projects.tableData);

  // Render components
  return (
    <div>
      {/* Skip link */}
      {skipLink}

      {/* Landmarks */}
      <header id="banner">Header</header>
      <footer>Footer</footer>

      {/* Table */}
      {/* Example integration of origin/main's table structure */}
      <table aria-label="Accessible Table">
        <thead>
          <tr>{columns.map(col => <th key={col.Accessor}>{col.Header}</th>)}</tr>
        </thead>
        <tbody>
          {/* Render rows */}
        </tbody>
      </table>

      {/* SVGs with aria labels */}
      <img src="/logo.svg" alt="Accessible Name for Logo" />
      <img src="/menu.svg" alt="Accessible Name for Menu Icon" />

      {/* Fixed fake link */}
      <a href="#" aria-label="Fake Link">
        Fake Link
      </a>

      {/* Main content */}
      <main id="mainContent">
        {projects.content}
      </main>
    </div>
  );
}