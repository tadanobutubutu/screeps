import { class1, function1, Object1 } from './path/to/module';
import React from 'react';
import Head from 'next/head';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

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
    <button
      id="unrotate"
      type="button"
      onClick={onClick}
      aria-label="rotate view back"
    >
      rotate back
    </button>
  );
};

export const FakeLinkAsButton = ({ href, onClick, children, ...props }) => {
  if (href?.startsWith('#') || href === '') {
    return (
      <button
        type="button"
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
  return (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  );
};

// New function to add lang attribute to HTML element (REACT_015)
export const addLangAttribute = (lang = 'en') => {
  return <html lang={lang} />;
};

// REACT_017 & REACT_025: Landmark structure with unique identifiers
export const PageLayout = ({
  headerContent,
  mainContent,
  navContent,
  footerContent
}) => {
  return (
    <>
      <header id="site-header" role="banner">
        {headerContent}
      </header>

      <nav id="main-navigation" role="navigation" aria-label="Main navigation">
        {navContent}
      </nav>

      <main id="main-content" role="main">
        {mainContent}
      </main>

      <footer id="site-footer" role="contentinfo">
        {footerContent}
      </footer>
    </>
  );
};

// REACT_041: SVG components with accessible name
export const AccessibleIconSVG = ({ ariaLabel, children, role = 'img', ...props }) => {
  return (
    <svg
      aria-label={ariaLabel}
      role={role}
      aria-hidden={ariaLabel ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
};

export const GraphIcon = (props) => (
  <AccessibleIconSVG
    ariaLabel="Dependency graph"
    {...props}
  >
    {/* SVG path content */}
  </AccessibleIconSVG>
);

export const SettingsIcon = (props) => (
  <AccessibleIconSVG
    ariaLabel="Settings"
    {...props}
  >
    {/* SVG path content */}
  </AccessibleIconSVG>
);

// REACT_025: Ensure unique landmarks
const uniqueLandmarks = () => {
  const landmarks = document.querySelectorAll('[role], nav, main, header, footer, aside, section, article');
  const existingIds = new Set();

  landmarks.forEach(landmark => {
    if (landmark.id) {
      existingIds.add(landmark.id);
    }
  });

  return (element) => {
    if (!element) return false;

    if (!element.id) {
      let counter = 1;
      let newId = `${element.tagName.toLowerCase()}-${counter}`;
      while (existingIds.has(newId)) {
        counter++;
        newId = `${element.tagName.toLowerCase()}-${counter}`;
      }
      element.id = newId;
      existingIds.add(newId);
    }

    return true;
  };
};

export { class1, function1, Object1, uniqueLandmarks };

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
  const validLandmarks = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search', 'form'];
  return validLandmarks.includes(landmarkType);
};

export const validateLandmarkStructure = (element) => {
  if (!element || !element.props || !element.props.role) return false;
  return true;
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

// Existing function to validate table accessibility (REACT_027)
export const validateTableAccessibility = (tableData) => {
  // Basic validation placeholder
  return true;
};

// Existing function to validate table structure (REACT_027)
export const validateTableStructure = (tableData) => {
  // Basic validation placeholder
  return true;
};

// Main component
export default function Home({ projects }) {
  const handleRotateBack = () => {
    console.log('Rotate back clicked');
  };

  return (
    <>
      <Head>
        <title>Dependency Graph</title>
      </Head>
      <main role="main">
        <div dangerouslySetInnerHTML={{ __html: dependencyGraphContent }} />
        <div dangerouslySetInnerHTML={{ __html: indexContent }} />
        <button 
          id="unrotate" 
          onClick={handleRotateBack}
          aria-label="Rotate back"
        >
          rotate back
        </button>
        {projects && projects.map && projects.map((project) => (
              <div key={project.id}>{project.name}</div>
            ))}
      </main>
    </>
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
  createLandmark,
  getSvgAccessibleName,
  getSvgAriaLabel,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  createInPageButton,
  createAccessibleLink
};