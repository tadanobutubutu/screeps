// Original code preserved below
// ...

// New function to address accessibility issues as per the insight report
function addressAccessibilityIssues() {
  // ReACT_015: Add lang attribute to HTML element
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', htmlElement.lang || 'en');
    }
  }

  // Import dependency graph and index content modules
  import { dependencyGraphContent } from './dependencyGraphContent';
  import { indexContent } from './indexContent';

  // ReACT_027: React Table Structure
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

  // ReACT_027: React Table Structure
  function validateTableStructure(htmlContent) {
    // Ensure tables have proper structure with thead and tbody
    let modifiedContent = htmlContent;

    // Call the existing landmark validation function
    const landmarkValidatedHtmlContent = validateLandmark(htmlContent);

    // Pattern to match table elements that need structure
    const tableRegex = /<table(\s[^>]*)?>([\s\S]*?)<\/table>/gi;

    modifiedContent = modifiedContent.replace(tableRegex, (match, attrs, content) => {
      let result = `<table${attrs || ''}>`;

      // Check if thead exists
      const hasThead = /<thead[\s\S]*?<\/thead>/i.test(content);
      const hasTbody = /<tbody[\s\S]*?<\/tbody>/i.test(content);

      // If no thead or tbody, wrap content appropriately
      // Ensure the table landmark is properly set (ReACT_017)
      if (!hasThead && !hasTbody) {
        if (landmarkValidatedHtmlContent.match(/<table/i)) {
          // Wrap all content in tbody
          result += `<tbody>${content}</tbody>`;
        } else {
          // Wrap content in both thead and tbody, with proper landmark (ReACT_017)
          result += `<thead><tr></tr></thead><tbody>${content}</tbody>`;
        }
      } else if (hasThead && !hasTbody) {
        // Extract thead and wrap remaining in tbody
        const theadMatch = content.match(/<thead[\s\S]*?<\/thead>/i);
        if (theadMatch) {
          result += theadMatch[0];
          const remaining = content.replace(theadMatch[0], '');
          result += `<tbody>${remaining}</tbody>`;
        } else {
          // Wrap content in both thead and tbody, with proper landmark (ReACT_017)
          result += `<thead><tr></tr></thead><tbody>${content}</tbody>`;
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
            result += `<thead><tr></tr></thead>${content}`;
          }
        } else {
          // Wrap content in both thead and tbody, with proper landmark (ReACT_017)
          result += `<thead><tr></tr></thead><tbody>${content}</tbody>`;
        }
      } else {
        result += content;
      }

      result += `</table>`;
      return result;
    });

    return modifiedContent;
  }

  // ReACT_017: React Landmarks
  function validateLandmark(htmlContent) {
    let modifiedContent = htmlContent;

    // Ensure proper landmark elements are used
    // - Use <header> for site header (not multiple)
    // - Use <nav> for navigation regions with aria-label
    // - Use <main> for main content (only one per page)
    // - Use <footer> for footer content

    // Extract landmark elements
    const landmarks = {
      header: document.querySelectorAll('header:not([role])'),
      nav: document.querySelectorAll('nav'),
      main: document.querySelectorAll('main'),
      footer: document.querySelectorAll('footer:not([role])'),
      aside: document.querySelectorAll('aside:not([aria-label])')
    };

    // Add role and aria-labels to landmark elements
    const headerIndex = 0;
    landmarks.header.forEach((header) => {
      if (!header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
        if (headerIndex === 0) {
          header.setAttribute('aria-label', 'Site header');
        }
        headerIndex++;
      }
    });

    let navIndex = 0;
    landmarks.nav.forEach((nav) => {
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
        let ariaLabel = 'Main Navigation';
        if (nav.getAttribute('aria-labelledby')) {
          const labelledBy = nav.getAttribute('aria-labelledby').split(' ');
          if (labelledBy.includes(ariaLabel)) {
            return;
          }
        }
        nav.setAttribute('aria-label', ariaLabel);
        navIndex++;
      }
    });

    if (landmarks.main.length === 0) {
      modifiedContent = `<main>${modifiedContent}</main>`;
    } else {
      const main = landmarks.main[0];
      if (!main.getAttribute('role')) {
        main.setAttribute('role', 'main');
      }
    }

    landmarks.footer.forEach((footer) => {
      if (!footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
      }
    });

    // Fix SVGs to have accessible names
    const svgs = modifiedContent.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        const titleId = `svg-title-${index}`;
        let title = svg.querySelector('title');
        if (!title) {
          title = document.createElement('title');
          title.id = titleId;
          title.textContent = `SVG graphic ${index + 1}`;
          svg.insertBefore(title, svg.firstChild);
        } else if (!title.id) {
          title.id = titleId;
        }
        svg.setAttribute('aria-labelledby', title.id);
      }
    });

    return modifiedContent;
  }

  // New function to fix table structure issues (REACT_027)
  export const fixTableStructureIssues = (tableData) => {
    if (!Array.isArray(tableData) || !tableData[0] || typeof tableData[0] !== 'object' || !tableData[0].hasOwnProperty('Header') || !tableData[0].hasOwnProperty('accessor')) {
      throw new Error('Invalid table data structure');
    }
    return tableData;
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

  // Existing function to render dependency graph
  function renderDependencyGraph() {
    // Existing code preserved below
    // ...
  }

  // Call the new function to ensure accessibility issues are addressed
  addressAccessibilityIssues();

  // Call the new function to render the dependency graph
  renderDependencyGraph();

  // Main component
  export default function Home({ projects }) {
    // ... existing code
  }

  // New TableValidation component
  function TableValidation({ tableData }) {
    const fixedTableData = fixTableStructureIssues(tableData);
    return (
      <table>
        {/* Table headers */}
        <thead>
          {fixedTableData[0].Header.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </thead>
        {/* Table body */}
        <tbody>
          {fixedTableData.slice(1).map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={`cell-${index}${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  export { TableValidation };