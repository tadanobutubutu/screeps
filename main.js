import React from 'react';
import Head from 'next/head';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

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

// New function to wrap primary content in a main element
export const wrapPrimaryContentInMain = (content) => {
  return <main role="main">{content}</main>;
};

// New function to add accessible names to SVGs (REACT_041)
export const addAccessibleNameToSVG = (svgElement, accessibleName) => {
  if (!svgElement) return null;
  
  return React.cloneElement(svgElement, {
    'aria-label': accessibleName,
    role: 'img'
  });
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

// New function to add proper landmark regions (REACT_XXXX)
export const addProperLandmarkRegions = (elements) => {
  const landmarkMap = {
    header: { role: 'banner', id: 'header' },
    nav: { role: 'navigation', id: 'main-navigation' },
    main: { role: 'main', id: 'main-content' },
    footer: { role: 'contentinfo', id: 'footer' }
  };
  
  if (!elements || !Array.isArray(elements)) return elements;
  
  return elements.map((child) => {
    if (!child) return child;
    if (child.props && child.props.landmark) {
      const { type, id } = child.props.landmark;
      if (landmarkMap[type]) {
        return React.cloneElement(child, {
          role: landmarkMap[type].role,
          id: id || landmarkMap[type].id
        });
      }
    }
    return child;
  }).map((child) => {
    if (!child || !child.props) return child;
    
    const childType = child.type;
    let props = { ...child.props };
    
    if (childType === 'header' || childType === 'div' || childType === 'main') {
      props.role = props.role || childType;
      props.id = props.id || '';
    }
    
    return React.cloneElement(child, props);
  });
};

// Add back required exports that might have been removed
export { default } from './main';

// Main component
export default function Home({ projects }) {
  const handleRotateBack = () => {
    console.log('Rotate back clicked');
  };

  return (
    <div>
      <Head>
        <title>Dependency Graph</title>
      </Head>
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
    </div>
  );
}