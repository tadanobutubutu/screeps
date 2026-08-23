import React from 'react';
import Head from 'next/head';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// TODO: This is the existing code that needs to be preserved

// Add new function to fix table structure issues (REACT_027)
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

// New function to add accessible names to SVGs (REACT_041)
export const addAccessibleNameToSVG = (svgElement, accessibleName) => {
  return React.cloneElement(svgElement, {
    'aria-label': accessibleName,
    role: 'img'
  });
};

// New function to add/fix landmark issues (REACT_017)
export const createLandmark = (element, landmarkType, id) => {
  const landmarkAttributes = {
    role: landmarkType,
    id: id
  };
  return React.cloneElement(element, landmarkAttributes);
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

  // Wrap primary content in main element for landmark
  const wrappedContent = wrapPrimaryContentInMain(
    <div id="main-content">
      {/* Main content here */}
    </div>
  );

  return (
    <div {...langAttr}>
      <Head>
        <html lang="en" />
      </Head>
      {/* Skip link for accessibility */}
      {skipLink}
      <header role="banner" id="header">
        {/* Header content */}
      </header>
      <nav role="navigation" id="main-navigation" aria-label="Main navigation">
        {/* Navigation content */}
      </nav>
      {wrappedContent}
      <footer role="contentinfo" id="footer">
        {/* Footer content */}
      </footer>
    </div>
  );
}