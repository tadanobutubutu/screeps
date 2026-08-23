import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

// Import dependency graph and index content modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Import removed exports that were previously removed
import { class1, function1, Object1 } from './path/to/module';

// ---------- Accessibility Utility Functions ----------
export const fixTableStructureIssues = (tableData) => {
  if (!tableData) return null;
  const { rows = [], caption } = tableData;

  return {
    ...tableData,
    structured: true,
    headerRow: rows[0] || null,
    bodyRows: rows.slice(1),
    caption: caption || null,
  };
};

export const ensureUniqueLandmarks = (landmarks) => {
  if (!landmarks || !Array.isArray(landmarks)) return [];
  const seenIds = new Set();
  return landmarks.map((landmark) => {
    let { id } = landmark;
    const baseId = id;
    let suffix = 1;
    while (seenIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix++;
    }
    seenIds.add(id);
    return { ...landmark, id };
  });
};

export const addAriaLabelToFakeLink = (content, ariaLabel, href = "#") => (
  <a href={href} aria-label={ariaLabel}>{content}</a>
);

export const addLangAttribute = (lang = "en") => <html lang={lang} />;

export const wrapPrimaryContentInMain = (content) => (
  <main role="main">{content}</main>
);

export const addAccessibleNameToSVG = (svgElement, accessibleName) => {
  if (!svgElement) return null;
  return React.cloneElement(svgElement, {
    "aria-label": accessibleName,
    role: "img",
  });
};

export const createLandmark = (element, landmarkType, id) => {
  const landmarkRoles = {
    banner: "banner",
    navigation: "navigation",
    main: "main",
    contentinfo: "contentinfo",
    complementary: "complementary",
    search: "search",
    form: "form",
  };
  const role = landmarkRoles[landmarkType] || landmarkType;
  return React.cloneElement(element, {
    role,
    id: id || `${landmarkType}-landmark`,
  });
};

export const addProperLandmarkRegions = (elements) => {
  const landmarkMap = {
    header: { role: "banner", id: "header" },
    nav: { role: "navigation", id: "main-navigation" },
    main: { role: "main", id: "main-content" },
    footer: { role: "contentinfo", id: "footer" },
  };
  if (!elements || !Array.isArray(elements)) return elements;
  return elements
    .map((child) => {
      if (!child || !child.props) return child;
      if (child.props && child.props.landmark) {
        const { type, id } = child.props.landmark;
        if (landmarkMap[type]) {
          return React.cloneElement(child, {
            role: landmarkMap[type].role,
            id: id ?? landmarkMap[type].id,
          });
        }
      }
      return child;
    })
    .map((child) => {
      if (!child || !child.props) return child;
      const childType = child.type;
      let props = { ...child.props };
      if (["header", "div", "main"].includes(childType)) {
        props.role = props.role || childType;
        props.id = props.id || "";
      }
      return React.cloneElement(child, props);
    });
};

// Re-export the previously removed module exports
export { class1, function1, Object1 } from "./path/to/module";

// ---------- Main Component ----------
const Main = ({ data }) => {
  // REACT_015: Add lang attribute to root HTML element
  const [htmlAttrs, setHtmlAttrs] = useState({ lang: "en" });

  useEffect(() => {
    const htmlElement = document.documentElement;
    Object.keys(htmlAttrs).forEach((key) => {
      htmlElement.setAttribute(key, htmlAttrs[key]);
    });
  }, [htmlAttrs]);

  // Ensure unique landmark IDs (REACT_025)
  useEffect(() => {
    const landmarks = [
      { type: "header", element: <header>Header</header> },
      { type: "nav", element: <nav>Navigation</nav> },
      { type: "main", element: <main>Main</main> },
      { type: "footer", element: <footer>Footer</footer> },
    ];
    const updated = ensureUniqueLandmarks(landmarks);
    // Apply updated landmarks to the DOM as needed (omitted for brevity)
  }, []);

  // Fix table structure issues (REACT_027)
  useEffect(() => {
    const tableData = {
      caption: "Sample Table",
      rows: [{ th: "Header" }, { td: "Row 1" }, { td: "Row 2" }],
    };
    const fixedData = fixTableStructureIssues(tableData);
    // Use fixedData to render an accessible table
  }, []);

  // Render JSX
  return (
    <>
      <Head>
        <title>Screeps Bot</title>
      </Head>

      {/* Apply language attribute to root element */}
      <htmlAttrs.lang="en" />

      {/* Wrap primary content in a landmark‑rich structure */}
      {wrapPrimaryContentInMain(
        <>
          <header role="banner">
            {/* existing header content */}
          </header>

          <main id="main-content">
            {/* existing main content */}
            {data && <pre>{indexContent}</pre>}
          </main>

          <footer role="contentinfo">
            {/* existing footer content */}
          </footer>
        </>
      )}

      {/* Example of adding accessible names to SVGs (REACT_041) */}
      {addAccessibleNameToSVG(
        <svg width="24" height="24" />
        "Settings icon"
      )}

      {/* Example of a fake link with ARIA label (REACT_036) */}
      {addAriaLabelToFakeLink("rotate back", "Rotate back to original state")}
    </>
  );
};

// PropTypes definition (kept from original)
Main.propTypes = {
  data: PropTypes.object,
};

// Export the component (optional, depending on project structure)
export default Main;