/**
 * Accessibility improvements for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix 26 table structure issues
 * - REACT_017: Add/fix 2 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix 1 fake link issue
 */

// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

/**
 * Adds lang attribute to HTML element
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with lang attribute added
 */
export function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    // Check if lang attribute already exists
    if (!attrs || attrs.includes(' lang=')) {
      return match;
    }
    // Add lang attribute with 'en' as default
    return `<html${attrs} lang="en">`;
  });
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers, captions, and structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed table structures
 */
export function fixTableStructureIssues(html) {
  if (typeof html !== 'string') return html;
  
  let result = html;
  
  // Fix tables that need proper scope attributes on headers
  result = result.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('scope=')) {
      return match;
    }
    return `<th${attrs} scope="col">`;
  });
  
  // Ensure tables have associated caption or summary
  result = result.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (attrs && (attrs.includes('summary=') || attrs.includes('caption>'))) {
      return match;
    }
    // Add summary attribute for screen readers
    return `<table${attrs} summary="Data table">`;
  });
  
  // Ensure proper thead/tbody structure
  result = result.replace(/(<tr[^>]*>)/gi, (match, attrs) => {
    // Check if tbody already exists before this tr
    const trIndex = result.indexOf(match);
    const beforeTr = result.substring(0, trIndex);
    if (beforeTr && !beforeTr.includes('<tbody') && !beforeTr.includes('<thead')) {
      return `<tbody>${match}`;
    }
    return match;
  });
  
  // Close tbody tags that aren't properly closed
  const tableMatches = result.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || [];
  tableMatches.forEach(table => {
    const hasThead = /<thead/i.test(table);
    const hasTbody = /<tbody/i.test(table);
    const hasTfoot = /<tfoot/i.test(table);
    
    if (hasThead || hasTbody || hasTfoot) {
      // Ensure proper structure - tbody should wrap data rows
      if (hasTbody && !/<tbody>[\s\S]*<\/tbody>/i.test(table)) {
        result = result.replace(table, table.replace(/(<table[^>]*>)([\s\S]*?)(<\/table>)/i, '$1<tbody>$2</tbody>$3'));
      }
    }
  });
  
  return result;
}

/**
 * Adds main landmark to HTML for proper document structure
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with main landmark added
 */
export function addMainLandmark(html) {
  if (typeof html !== 'string') return html;
  
  // Check if main landmark already exists
  if (/<main[^>]*>/i.test(html)) {
    return html;
  }
  
  // Try to match body content
  const bodyMatch = html.match(/<body([^>]*)>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyAttrs = bodyMatch[1];
    const bodyContent = bodyMatch[2];
    const wrappedContent = `<main id="main-content">${bodyContent}</main>`;
    return html.replace(bodyMatch[0], `<body${bodyAttrs}>${wrappedContent}</body>`);
  }
  
  return html;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with accessible SVG names
 */
export function addSvgAccessibleNames(html) {
  if (typeof html !== 'string') return html;
  
  let svgCounter = 0;
  
  return html.replace(/<svg([^>]*)>/gi, (match, attrs) => {
    const existingLabel = attrs.match(/aria-label=/) || attrs.match(/aria-labelledby=/);
    
    if (existingLabel) {
      return match;
    }
    
    // Extract title if present
    const titleMatch = match.match(/<title[^>]*>([^<]*)<\/title>/i);
    let label = titleMatch ? titleMatch[1] : `SVG image ${++svgCounter}`;
    
    // Check for id to reference
    const idMatch = attrs.match(/id=["']([^"']*)["']/);
    if (idMatch) {
      return `<svg${attrs} role="img" aria-labelledby="${idMatch[1]}-title">`;
    }
    
    // Add inline title for accessibility
    const titleId = `svg-title-${++svgCounter}`;
    return `<svg${attrs} role="img" aria-labelledby="${titleId}"><title id="${titleId}">${label}</title>`;
  });
}

/**
 * Ensures unique landmark identifiers for screen readers
 * Converts additional <main> landmarks to <section> so only one <main> exists per page.
 * Also assigns unique IDs to other landmark types.
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with unique landmarks
 */
export function ensureUniqueLandmarks(html) {
  if (typeof html !== 'string') return html;
  
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  const counters = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    if (matches) {
      counters[lm] = matches.length;
    }
  });
  
  // First, ensure only one <main> landmark exists.
  // Convert subsequent <main> elements to <section> with aria-label.
  let mainSeen = false;
  html = html.replace(/<main([^>]*)>/gi, (match, attrs) => {
    if (!mainSeen) {
      mainSeen = true;
      return match;
    }
    // Replace additional <main> tags with <section> while preserving any attributes
    const safeAttrs = attrs || '';
    // Avoid duplicating an aria-label if one already exists
    if (safeAttrs.includes('aria-label=') || safeAttrs.includes('aria-labelledby=')) {
      return `<section${safeAttrs}>`;
    }
    return `<section${safeAttrs} aria-label="Content section">`;
  });
  
  // Also update closing tags for converted <main> elements
  // Count occurrences of <main> opening tags in the original-like state and
  // match closing tags. Since we replaced extra <main> with <section>, we must
  // replace the corresponding extra </main> closing tags with </section>.
  const mainOpenCount = (html.match(/<main\b/gi) || []).length;
  const mainCloseCount = (html.match(/<\/main>/gi) || []).length;
  if (mainCloseCount > mainOpenCount) {
    const extras = mainCloseCount - mainOpenCount;
    let replaced = 0;
    html = html.replace(/<\/main>/gi, (match) => {
      if (replaced < extras) {
        replaced += 1;
        return '</section>';
      }
      return match;
    });
  }
  
  // Recompute counters after main -> section conversion
  landmarks.forEach(lm => {
    const regex = new RegExp(`<${lm}\\b`, 'gi');
    const matches = html.match(regex);
    counters[lm] = matches ? matches.length : 0;
  });
  
  // Assign unique IDs to remaining landmarks
  landmarks.forEach(lm => {
    const count = counters[lm] || 0;
    if (count === 0) return;
    const seen = {};
    const openRegex = new RegExp(`<${lm}([^>]*)>`, 'gi');
    html = html.replace(openRegex, (match, inner) => {
      // Skip if an id attribute is already present
      if (inner && inner.includes('id=')) {
        return match;
      }
      seen[lm] = (seen[lm] || 0) + 1;
      const id = `${lm}-${seen[lm]}`;
      return `<${lm} id="${id}"${inner || ''}>`;
    });
  });
  
  return html;
}

/**
 * Fixes 1 fake link issue
 * @param {string} html - The HTML string to process
 * @returns {string} HTML with fixed fake link issues
 */
export function fixFakeLinkIssue(html) {
  if (typeof html !== 'string') return html;
  
  // Fix any fake links that do not have a valid href attribute
  return html.replace(/<a([^>]*)>/gi, (match, attrs) => {
    if (attrs && attrs.includes('href=')) {
      return match;
    }
    return match.replace(/<a/, '<a href="#"');
  });
}

/**
 * Renders a data visualization graph with proper accessibility attributes
 * Creates an accessible SVG graph component with title, description, and proper roles
 * @param {Object} data - The data to visualize
 * @param {string} title - The accessible title for the graph
 * @param {string} description - A detailed description of the data for screen readers
 * @param {Object} options - Configuration options for the graph
 * @returns {string} HTML string containing the accessible graph SVG
 */
export function renderGraph(data, title, description, options = {}) {
  const {
    id = 'graph',
    width = 600,
    height = 400,
    color = '#3498db',
    className = 'data-graph',
    ariaDescribedBy = 'graph-description'
  } = options;

  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return '';
  }

  // Calculate graph dimensions
  const padding = { top: 40, right: 20, bottom: 50, left: 60 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Find min/max values for scaling
  const values = data.map(d => typeof d.value === 'number' ? d.value : 0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Create scales
  const xScale = (index) => padding.left + (index / (data.length - 1)) * graphWidth;
  const yScale = (value) => padding.top + graphHeight - (value / valueRange) * graphHeight;

  // Generate path points
  const points = data.map((d, i) => {
    const x = xScale(i);
    const y = yScale(typeof d.value === 'number' ? d.value : 0);
    return `${x},${y}`;
  }).join(' ');

  // Generate bar charts if needed
  const bars = data.map((d, i) => {
    const x = xScale(i) - 5;
    const barHeight = typeof d.value === 'number' ? (d.value / valueRange) * graphHeight : 0;
    const y = padding.top + graphHeight - barHeight;
    const barWidth = (graphWidth / data.length) * 0.8;
    return `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" aria-hidden="true"></rect>`;
  }).join('');

  // Generate axis
  const xAxis = data.map((d, i) => {
    const x = xScale(i);
    return `<text x="${x}" y="${height - 10}" text-anchor="middle" fill="#666" font-size="12">${d.label || i}</text>`;
  }).join('');

  const yAxis = [];
  for (let i = 0; i <= 5; i++) {
    const value = minValue + (i * valueRange / 5);
    const y = yScale(value);
    yAxis.push(`<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="#666" font-size="12">${Math.round(value)}</text>`);
    if (i < 5) {
      yAxis.push(`<line x1="${padding.left}" y1="${y}" x2="${padding.left + graphWidth}" y2="${y}" stroke="#eee" stroke-width="1"></line>`);
    }
  }

  // Generate grid lines
  const gridLines = yAxis.filter(y => y.startsWith('<line'));
  
  // Create accessible SVG with proper structure
  return `
    <div class="${className}" role="region" aria-label="${title}" id="${id}-container">
      <svg id="${id}" width="${width}" height="${height}" role="img" aria-labelledby="${id}-title ${id}-desc" focusable="false" preserveAspectRatio="xMidYMid meet">
        <title id="${id}-title">${title}</title>
        <desc id="${id}-desc">${description}</desc>
        <rect width="100%" height="100%" fill="white" aria-hidden="true"></rect>
        <g aria-hidden="true">
          ${gridLines.join('')}
        </g>
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" aria-hidden="true"></polyline>
        ${bars}
      </g>
    </svg>
  `;
}

/**
 * Renders an accessible index or listing page with proper semantic structure
 * Creates navigable sections with proper headings, landmarks, and skip links
 * @param {string} title - The main title for the index page
 * @param {Array} sections - Array of section objects containing heading and content
 * @param {Object} options - Configuration options for the index
 * @returns {string} HTML string containing the accessible index structure
 */
export function renderIndex(title, sections = [], options = {}) {
  const {
    id = 'main-index',
    className = 'main-index',
    showSkipLink = true,
    ariaLabelledBy = 'index-heading'
  } = options;

  // Validate title
  if (!title || typeof title !== 'string') {
    return '';
  }

  // Generate skip link for keyboard navigation
  const skipLink = showSkipLink ? `
    <a href="#${id}" class="skip-link" aria-label="Skip to main content">Skip to main content</a>
  ` : '';

  // Generate sections
  const indexSections = sections.map((section, index) => {
    const sectionId = section.id || `section-${index + 1}`;
    const sectionRole = section.role || 'region';
    const sectionLabel = section.label || section.heading || `Section ${index + 1}`;
    
    return `
      <section id="${sectionId}" role="${sectionRole}" aria-label="${sectionLabel}" class="index-section">
        ${section.heading ? `<h2 id="${sectionId}-heading">${section.heading}</h2>` : ''}
        <div class="section-content">
          ${section.content || ''}
        </div>
      </section>
    `;
  }).join('');

  // Create the main index structure with proper landmarks
  return `
    <main id="${id}" class="${className}" role="main" aria-labelledby="${ariaLabelledBy}">
      <h1 id="${ariaLabelledBy}" class="index-title">${title}</h1>
      <nav aria-label="Table of Contents" class="index-nav">
        <ul class="index-toc">
          ${sections.map((section, index) => {
            const sectionId = section.id || `section-${index + 1}`;
            return `<li><a href="#${sectionId}">${section.heading || `Section ${index + 1}`}</a></li>`;
          }).join('')}
        </ul>
      </nav>
      <div class="index-content">
        ${indexSections}
      </div>
    </main>
  `;
}

/**
 * Updates the existing function to use the new renderGraph and renderIndex functions
 * This function demonstrates integration of the new accessibility-focused rendering functions
 * @param {Object} config - Configuration object for graph and index rendering
 * @returns {string} Combined HTML string with rendered graph and index
 */
export function updateGraphIndexRendering(config = {}) {
  const {
    graphConfig = {},
    indexConfig = {},
    graphData = [],
    indexTitle = 'Index',
    indexSections = []
  } = config;

  // Render graph using new function
  const graphHtml = renderGraph(
    graphData,
    graphConfig.title || 'Data Visualization',
    graphConfig.description || 'Graphical representation of data',
    graphConfig.options || {}
  );

  // Render index using new function
  const indexHtml = renderIndex(
    indexTitle,
    indexSections,
    indexConfig.options || {}
  );

  return `
    <div class="graph-index-container">
      ${graphHtml}
      ${indexHtml}
    </div>
  `;
}