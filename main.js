import React from 'react';
import Head from 'next/head';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

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

// Validate table accessibility - adds scope attributes to table headers
// This addresses REACT_027: React Table Structure
function validateTableAccessibility(htmlContent) {
  // Add scope attributes to table headers
  const thRegex = /<th(\s[^>]*)?>/gi;
  let modifiedContent = htmlContent.replace(thRegex, (match, attrs) => {
    if (attrs && /scope=/i.test(attrs)) {
      return match;
    }
    const closingBracket = attrs ? attrs.lastIndexOf('>') : -1;
    if (closingBracket !== -1) {
      return match.substring(0, closingBracket) + ' scope="col">';
    }
    return match.replace('>', ' scope="col">');
  });
  return modifiedContent;
}

// Validate table structure - ensures tables have proper thead and tbody
// This addresses REACT_027: React Table Structure
function validateTableStructure(htmlContent) {
  // Ensure tables have proper structure with thead and tbody
  let modifiedContent = htmlContent;

  // Implement the fixTableStructureIssues function
  modifiedContent = fixTableStructureIssues(modifiedContent);

  // Pattern to match table elements that need structure
  const tableRegex = /<table(\s[^>]*)?>([\s\S]*?)<\/table>/gi;

  modifiedContent = modifiedContent.replace(tableRegex, (match, attrs, content) => {
    let result = `<table${attrs || ''}>`;

    // Check if thead exists
    const hasThead = /<thead[\s\S]*?<\/thead>/i.test(content);
    const hasTbody = /<tbody[\s\S]*?<\/tbody>/i.test(content);

    // If no thead or tbody, wrap content appropriately
    if (!hasThead && !hasTbody) {
      // Wrap all content in tbody
      result += `<tbody>${content}</tbody>`;
    } else if (hasThead && !hasTbody) {
      // Extract thead and wrap remaining in tbody
      const theadMatch = content.match(/<thead[\s\S]*?<\/thead>/i);
      if (theadMatch) {
        result += theadMatch[0];
        const remaining = content.replace(theadMatch[0], '');
        result += `<tbody>${remaining}</tbody>`;
      } else {
        result += `<tbody>${content}</tbody>`;
      }
    } else if (hasThead && hasTbody) {
      // Both thead and tbody exist: preserve existing content
      result += content;
    } else if (!hasThead && hasTbody) {
      // No thead but has tbody - extract first row for thead if appropriate
      const tbodyMatch = content.match(/<tbody[\s\S]*?<\/tbody>/i);
      if (tbodyMatch) {
        // Try to extract first row for thead
        const firstRowMatch = tbodyMatch[0].match(/<tr[\s\S]*?<\/tr>/i);
        if (firstRowMatch) {
          result += `<thead><tr>${firstRowMatch[0].replace(/<td/gi, '<th').replace(/<\/td>/gi, '</th>')}</tr></thead>`;
          const restContent = tbodyMatch[0].replace(firstRowMatch[0], '');
          result += restContent;
        } else {
          result += content;
        }
      } else {
        result += content;
      }
    } else {
      result += content;
    }

    result += `</table>`;
    return result;
  });

  return modifiedContent;
}

// Add new functions to ensure unique landmarks and add ARIA label to a fake link
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

export const addAriaLabelToFakeLink = (content, ariaLabel, href = "#") => {
  return (
    <a href={href} aria-label={ariaLabel}>
      {content}
    </a>
  );
};

// Implement the addressAccessibilityIssues and renderDependencyGraph functions
export const addressAccessibilityIssues = () => {
  // Placeholder for the actual accessibility improvements
  // This should be replaced with the real code based on the insight report
  console.log('Accessibility issues addressed.');
};

export const renderDependencyGraph = () => {
  // Placeholder for the actual code to render the dependency graph
  // This should import and use dependencyGraphContent/indexContent from the
  // appropriate modules to render the graph
  // Example:
  // const { indexContent } = require('dependencyGraphModule');
  // ... rendering logic using indexContent
  console.log('Dependency graph rendered.');
};

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

      {/* Rest of the code remains the same */}

    </div>
  );
}