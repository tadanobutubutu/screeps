import React from 'react';
import Head from 'next/head';

// ============================================
// Accessibility Utility Functions
// ============================================

// REACT_027: Function to fix table structure issues (array of tables)
export function fixTableStructureIssues(tables) {
  return tables.map((table, tableIndex) => ({
    ...table,
    caption: table.caption || `Table ${tableIndex + 1}`,
    hasHeaderRow: table.hasHeaderRow !== false,
    headers: table.headers || []
  }));
}

// Single table data structure fix (from HEAD, fixed)
export const fixSingleTableStructure = (tableData) => {
  if (!tableData) return null;
  const { rows = [], caption } = tableData;
  return {
    ...tableData,
    structured: true,
    headerRow: rows[0] || null,
    bodyRows: rows.slice(1),
    caption: caption || null
  };
};

// REACT_025: Function to ensure unique landmarks (DOM-based)
export function ensureUniqueLandmarks(container) {
  const landmarks = container.querySelectorAll('[role]');
  const seenIds = new Set();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    let existingId = landmark.id;
    
    if (existingId && !seenIds.has(existingId)) {
      seenIds.add(existingId);
    } else {
      let counter = 1;
      let newId = `${role}-${counter}`;
      while (seenIds.has(newId)) {
        counter++;
        newId = `${role}-${counter}`;
      }
      landmark.id = newId;
      seenIds.add(newId);
    }
  });
  
  return container;
}

// Array-based unique landmarks (from HEAD, fixed)
export const ensureUniqueLandmarkIds = (landmarks) => {
  if (!landmarks || !Array.isArray(landmarks)) return [];
  const seenIds = new Set();
  return landmarks.map((landmark) => {
    let { id } = landmark;
    let suffix = 1;
    let newId = id;
    while (seenIds.has(newId)) {
      newId = `${id}-${suffix}`;
      suffix++;
    }
    seenIds.add(newId);
    return { ...landmark, id: newId };
  });
};

// REACT_036: Convert fake links to accessible buttons
export const addAriaLabelToFakeLink = (content, ariaLabel, href = "#") => {
  if (href?.startsWith('#') || href === '') {
    return (
      <button 
        type="button"
        aria-label={ariaLabel}
        onClick={() => {}}
      >
        {content}
      </button>
    );
  }
  return <a href={href} aria-label={ariaLabel}>{content}</a>;
};

export const wrapPrimaryContentInMain = (content) => {
  return <main>{content}</main>;
};

export const addLangAttribute = (lang = 'en') => {
  return <html lang={lang} />;
};

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

// ============================================
// Accessibility Components
// ============================================

// REACT_015: Wrapper component with lang attribute
export const AppWrapper = ({ lang, children }) => {
  return (
    <div lang={lang}>
      {children}
    </div>
  );
};

// REACT_036: Accessible rotate back button
export const RotateBackButton = ({ onClick }) => {
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
  } else {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }
};

// REACT_027 & REACT_025: Accessible table component
export const DependencyGraphTable = ({ data }) => {
  return (
    <table>
      <caption style={{ textAlign: 'left' }}>
        Dependency relationships visualization
      </caption>
      <thead>
        <tr>
          {data.columns.map((column, index) => (
            <th key={index} id={`header-${index}`} scope="col">
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => (
              <td key={cellIndex} headers={`header-${cellIndex}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// REACT_017 & REACT_025: Page layout with proper landmarks
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

// REACT_041: SVG components with accessible names
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

// Utility function for generating unique IDs
export function generateId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${randomPart}`;
}

// ============================================
// Main Page Component (from HEAD)
// ============================================
export default function Home({ projects }) {
  return (
    <div>
      <Head>
        <title>Dependency Graph</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:description" content="A responsive dependency graph application using React, Next.js, and D3.js" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dependency Graph" />
        <meta property="og:url" content="https://dependency-graph.com" />
        <meta property="og:image" content="https://dependency-graph.com/logo.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Dependency Graph" />
      </Head>
      <body>
        <main role="main">
          <div dangerouslySetInnerHTML={{ __html: '' }} />
          <div dangerouslySetInnerHTML={{ __html: '' }} />
          <RotateBackButton onClick={() => {}} />
          {projects && projects.map((project) => (
            <div key={project.id}>{project.name}</div>
          ))}
        </main>
      </body>
    </div>
  );
}

// ============================================
// Exports
// ============================================
export { 
  RotateBackButton, 
  FakeLinkAsButton, 
  DependencyGraphTable,
  AccessibleIconSVG,
  GraphIcon,
  SettingsIcon,
  AppWrapper,
  PageLayout,
  fixTableStructureIssues,
  fixSingleTableStructure,
  ensureUniqueLandmarks,
  ensureUniqueLandmarkIds,
  addAriaLabelToFakeLink,
  wrapPrimaryContentInMain,
  addLangAttribute,
  createLandmark,
  generateId
};