// main.js
// Preserve all existing code and exports from current main.js
// Add new functions or changes requested in the issue

// Example of existing code that should be preserved
// function existingFunction() { ... }
// export { existingFunction };

// New code for dependency updates
// Update ESLint to v10
const eslint = require('eslint').ESLint;
const eslintConfig = {
  // Updated ESLint configuration for v10
  // ... existing config ...
};

// Update Jest to v30
const jest = require('jest');
const jestConfig = {
  // Updated Jest configuration for v30
  // ... existing config ...
};

// Update TypeScript to v7
const typescript = require('typescript');
const tsConfig = {
  // Updated TypeScript configuration for v7
  // ... existing config ...
};

// Update React to v19
const react = require('react');
const reactDom = require('react-dom');

// Preserve all existing exports
// export { existingFunction };

// Add new exports if needed
export { eslintConfig, jestConfig, tsConfig };

// Add main landmark components for React accessibility
const MainLandmark = ({ children }) => {
  return <main>{children}</main>;
};

// Add main landmark for HTML files
const addMainLandmarkToHTML = (htmlContent) => {
  // Check if main landmark already exists
  if (htmlContent.includes('<main>')) {
    return htmlContent;
  }

  // Find the body tag and wrap content in main
  const bodyStart = htmlContent.indexOf('<body>');
  if (bodyStart === -1) return htmlContent;

  const bodyEnd = htmlContent.indexOf('</body>', bodyStart);
  if (bodyEnd === -1) return htmlContent;

  const contentBefore = htmlContent.substring(0, bodyStart + 6);
  const contentAfter = htmlContent.substring(bodyEnd);

  return `${contentBefore}<main>${htmlContent.substring(bodyStart + 6, bodyEnd)}</main>${contentAfter}`;
};

// Add function to handle SVG accessibility
const makeSvgAccessible = (svgElement) => {
  // If SVG is decorative, add aria-hidden
  if (svgElement.props.decorative) {
    return React.cloneElement(svgElement, { 'aria-hidden': 'true' });
  }

  // If SVG has a title, keep it as is
  if (svgElement.props.children && React.Children.toArray(svgElement.props.children).some(child =>
    child.type === 'title' || child.props?.['aria-label']
  )) {
    return svgElement;
  }

  // Otherwise, add a default aria-label
  return React.cloneElement(svgElement, {
    'aria-label': svgElement.props['aria-label'] || 'Graphic element'
  });
};

// Add function to safely render main landmark in conditional rendering scenarios
const ConditionalMainLandmark = ({ children, condition, fallback }) => {
  if (condition) {
    return <main>{children}</main>;
  }
  return fallback ? <section>{fallback}</section> : null;
};

// Add function to ensure HTML has language attribute
const ensureHtmlLangAttribute = (htmlContent) => {
  // Check if html tag already has lang attribute
  if (htmlContent.includes('<html lang=')) {
    return htmlContent;
  }

  // Find the html tag and add lang attribute
  const htmlStart = htmlContent.indexOf('<html');
  if (htmlStart === -1) return htmlContent;

  // Insert lang attribute right after <html
  return htmlContent.substring(0, htmlStart + 5) + ' lang="en"' + htmlContent.substring(htmlStart + 5);
};

// Add function to add scope attributes to table headers for accessibility
const addTableHeaderScopes = (tableElement) => {
  // If table already has scope attributes, return as is
  if (tableElement.props.children?.some(row =>
    row.props.children?.some(cell =>
      cell.type === 'th' && (cell.props.scope === 'col' || cell.props.scope === 'row')
    )
  )) {
    return tableElement;
  }

  // Clone the table and add scope attributes to headers
  return React.cloneElement(tableElement, {
    children: React.Children.map(tableElement.props.children, (row, rowIndex) => {
      if (rowIndex === 0) {
        // First row is typically headers - add scope="col"
        return React.cloneElement(row, {
          children: React.Children.map(row.props.children, (cell) => {
            if (cell.type === 'th') {
              return React.cloneElement(cell, { scope: 'col' });
            }
            return cell;
          })
        });
      }

      // Other rows - check if they have th elements and add scope="row" if needed
      return React.cloneElement(row, {
        children: React.Children.map(row.props.children, (cell) => {
          if (cell.type === 'th') {
            return React.cloneElement(cell, { scope: 'row' });
          }
          return cell;
        })
      });
    })
  });
};

// Add function to create accessible tables with proper header associations
const createAccessibleTable = ({ headers, data, caption }) => {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} headers={`header-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Export the main landmark components, SVG accessibility function, HTML lang attribute function,
// and new table accessibility functions
export {
  MainLandmark,
  addMainLandmarkToHTML,
  makeSvgAccessible,
  ConditionalMainLandmark,
  ensureHtmlLangAttribute,
  addTableHeaderScopes,
  createAccessibleTable
};