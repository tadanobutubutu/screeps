import React from 'react';
import Head from 'next/head';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// TODO: Add back any required exports that might have been removed
// Here is an example of how to export a required function from another module:
// Import functions from other modules if needed
// const { someFunction } = require('./utils');

// Existing function to fix table structure issues (REACT_027)
export const fixTableStructureIssues = (tableData) => {
  if (!tableData) return null;

  const { rows = [], caption } = tableData;

  // Ensure proper table structure with thead and tbody
  return {
    ...tableData,
    structured: true,
    headerRow: rows[0] || null,
    bodyRows: rows.slice(1),
    caption: caption || null
  };
};

// New function to ensure unique landmarks (REACT_025)
export const ensureUniqueLandmarks = (landmarks) => {
  if (!landmarks || !Array.isArray(landmarks)) return [];

  const seenIds = new Set();

  return landmarks.map((landmark) => {
    let { id } = landmark;
    let suffix = 1;
    const baseId = id;

    while (seenIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix++;
    }

    seenIds.add(id);

    return {
      ...landmark,
      id
    };
  });
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
  return <html lang={lang} />;
};

// Function to retrieve lang attribute value (REACT_015)
export const getLangAttribute = () => {
  return 'lang="en"';
};

// Function to retrieve full lang attribute including element context (REACT_015)
export const getFullLangAttribute = () => {
  return '<html lang="en">';
};

// New function to wrap primary content in a main element
export const wrapPrimaryContentInMain = (content) => {
  return <main>{content}</main>;
};

// New function to add accessible names to SVGs (REACT_041)
export const addAccessibleNameToSVG = (svgElement, accessibleName) => {
  if (!svgElement) return null;

  return React.cloneElement(svgElement, {
    'aria-label': accessibleName,
    role: 'img'
  });
};

// Functions to support accessible naming for SVGs (REACT_041)
export const getSvgAccessibleName = (svgId) => {
  return `#${svgId}-title`;
};

export const getSvgAriaLabel = (label) => {
  return label || 'SVG graphic';
};

// New function to add landmark attributes to elements (REACT_017)
export const createLandmark = (element, landmarkType, id) => {
  const landmarkRoles = {
    banner: 'banner',
    navigation: 'navigation',
    main: 'main',
    contentinfo: 'contentinfo',
    complementary: 'complementary',
    search: 'search',
    form: 'form'
  };

  const role = landmarkRoles[landmarkType] || landmarkType;

  return React.cloneElement(element, {
    role,
    id: id || `${landmarkType}-landmark`
  });
};

// Functions to validate landmark structure and accessibility (REACT_017)
export const validateLandmark = (landmarkType) => {
  const validLandmarks = [
    'banner',
    'navigation',
    'main',
    'contentinfo',
    'complementary',
    'search',
    'form'
  ];
  return validLandmarks.includes(landmarkType);
};

export const validateLandmarkStructure = (element) => {
  if (!element || !element.props || !element.props.role) return false;
  return true;
};

// Functions to validate table accessibility and structure (REACT_027)
export const validateTableAccessibility = (tableData) => {
  if (!tableData || !tableData.rows || tableData.rows.length === 0) return true;
  return tableData.structured === true;
};

export const validateTableStructure = (tableData) => {
  if (!tableData || !tableData.rows || tableData.rows.length < 2) return false;
  return !!tableData.headerRow && tableData.headerRow.length > 0;
};

// Functions related to creating in-page buttons and accessible links (REACT_036)
export const createInPageButton = (label, onClick) => {
  return (
    <button aria-label={label} onClick={onClick}>
      {label}
    </button>
  );
};

export const createAccessibleLink = (content, href, ariaLabel) => {
  return (
    <a href={href} aria-label={ariaLabel}>
      {content}
    </a>
  );
};

// Main component
export default function Home({ projects }) {
  const handleRotateBack = () => {
    console.log('Rotate back clicked');
  };

  return (
    <div>
      <Head>
        <title>Dependency Graph</title>
        <htmlAttrs lang="en" />
      </Head>
      <body>
        <main role="main">
          <div {... __html: dependencyGraphContent }} />
          <div {... __html: indexContent }} />
          <button
            id="unrotate"
            ...
            aria-label="Rotate back"
          >
            rotate back
          </button>
          {projects && projects.map && projects.map((project) => (
            <div ...
          ))}
        </main>
      </body>
    </div>
  );
}

// Consolidated list of utility functions
export {
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  addAriaLabelToFakeLink,
  addLangAttribute,
  getLangAttribute,
  getFullLangAttribute,
  wrapPrimaryContentInMain,
  addAccessibleNameToSVG,
  createLandmark,
  getSvgAccessibleName,
  getSvgAriaLabel,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  createInPageButton,
  createAccessibleLink,
};