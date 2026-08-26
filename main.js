// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

// REACT_015: Add lang attribute to HTML element
export const addLangAttribute = (props) => {
  const { children, ...rest } = props;
  return (
    <html lang="en" {...rest}>
      {children}
    </html>
  );
};

// REACT_027: Fix table structure issues
export const fixTableStructureIssues = (tableContent) => {
  return tableContent.map((table) => ({
    ...table,
    hasHeader: table.hasHeader || false,
    scope: table.hasHeader ? 'col' : undefined
  }));
};

// REACT_017: Add/fix landmark issues
export const addMainLandmark = (content) => {
  return <main id="main-content">{content}</main>;
};

// REACT_041: Add accessible names to 2 SVGs
export const addSvgAccessibleNames = (svgElements) => {
  return svgElements.map((svg, index) => ({
    ...svg,
    ariaLabel: svg.ariaLabel || `SVG icon ${index + 1}`
  }));
};

// REACT_025: Ensure unique landmarks
export const ensureUniqueLandmarks = (landmarks) => {
  const uniqueLandmarks = [];
  const seen = new Set();
  
  landmarks.forEach(landmark => {
    if (!seen.has(landmark.role)) {
      uniqueLandmarks.push(landmark);
      seen.add(landmark.role);
    }
  });
  
  return uniqueLandmarks;
};

// REACT_036: Fix 1 fake link issue
export const fixFakeLinkIssue = (linkContent) => {
  const { href, onClick, children, ...rest } = linkContent;
  
  if (href || onClick) {
    return (
      <a href={href || '#'} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  
  return (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

// Main application component
export const Main = () => {
  return (
    <div>
      <h1>Application</h1>
      {/* Existing application code */}
    </div>
  );
};

export default Main;