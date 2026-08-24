// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
const dependencyGraphModule = require('./dependencyGraph');
const indexModule = require('./index');

// Accessibility: Updated dependencyGraphFunction to use dependencyGraphContent directly
// with proper accessibility attributes and semantic HTML
function dependencyGraphFunction() {
  const { dependencyGraphContent } = dependencyGraphModule;

  // Function for extracting external module names from the dependency graph
  function getExternalModules() {
    const externalModules = [];

    // Traverse through all nodes in the dependency graph and extract the external packages
    const nodes = dependencyGraphContent.graph.nodes;
    nodes.forEach((node) => {
      if (node.type === 'package' && node.package === 'external-package') {
        externalModules.push(node.name);
      }
    });

    // Return the list of extracted external modules
    return externalModules;
  }

  // Function for ensuring unique landmarks
  function ensureUniqueLandmarks() {
    const landmarks = new Map();
    let counter = 0;

    // Reassign IDs with uniqueness guarantee
    if (dependencyGraphContent.landmarks) {
      dependencyGraphContent.landmarks.forEach((landmark) => {
        const baseId = landmark.id || `landmark-${counter}`;
        const uniqueId = landmarks.has(baseId) ? `${baseId}-${counter}` : baseId;
        landmarks.set(baseId, uniqueId);
        landmark.id = uniqueId;
        counter++;
      });
    }
    return dependencyGraphContent;
  }

  // ---------------------------------------------------

  // Constant region for external modules
  const EXTERNAL_MODULES = getExternalModules();

  // Render the dependency graph
  const nodes = dependencyGraphContent.graph.nodes;
  const edges = dependencyGraphContent.graph.edges;
  const width = 800;
  const height = 600;

  // Create SVG for visualization
  const svg = `<svg role="img" aria-label="Dependency graph visualization" width="${width}" height="${height}">
    <title>Module Dependency Graph</title>
    <desc>A visual representation of the module dependencies in the project</desc>`;

  // Add edges
  edges.forEach((edge) => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (sourceNode && targetNode) {
      svg += `<line x1="${sourceNode.x}" y1="${sourceNode.y}" x2="${targetNode.x}" y2="${targetNode.y}" stroke="#666" stroke-width="2" />`;
    }
  });

  // Add nodes
  nodes.forEach((node) => {
    const isExternal = node.type === 'package' && EXTERNAL_MODULES.includes(node.name);
    const fillColor = isExternal ? '#ff6b6b' : '#4dabf7';
    svg += `<circle cx="${node.x}" cy="${node.y}" r="20" fill="${fillColor}" aria-label="${node.name}" />`;
    svg += `<text x="${node.x}" y="${node.y + 35}" text-anchor="middle">${node.name}</text>`;
  });

  svg += '</svg>';

  // Accessibility: Add back any required exports that might have been removed
  if (EXTERNAL_MODULES.length > 0) {
    const packageJsonPath = './package.json';
    let packageJson;

    try {
      packageJson = require(packageJsonPath);
    } catch (error) {
      console.warn('package.json not found, skipping external module validation');
    }

    if (packageJson) {
      Object.keys(packageJson.dependencies || {}).forEach((moduleName) => {
        if (!EXTERNAL_MODULES.includes(moduleName)) {
          console.warn(`The dependency graph indicates an external module (${moduleName}) that has no corresponding entry in package.json. Please double-check.`);
        } else {
          try {
            const requiredModule = require(moduleName);
            Object.entries(requiredModule).forEach(([exportName, exportedValue]) => {
              if (exportName !== '.') {
                if (exportedValue && exportedValue.default) {
                  module.exports[exportName] = exportedValue.default;
                } else {
                  module.exports[exportName] = exportedValue;
                }
              }
            });
          } catch (error) {
            console.warn(`Failed to require external module: ${moduleName}`);
          }
        }
      });
    }
  }

  // Accessibility: Implement fixes for 26 table structure issues (fixTableStructureIssues)
  function fixTableStructureIssues(content) {
    // Add proper table headers and structure for accessibility
    const tablePattern = /<table[^>]*>([\s\S]*?)<\/table>/g;
    return content.replace(tablePattern, (match, tableContent) => {
      if (!tableContent.includes('<th')) {
        // Add scope attributes to header cells
        const headerRowMatch = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/);
        if (headerRowMatch) {
          const headerRow = headerRowMatch[1];
          const headers = headerRow.replace(/<td/g, '<th scope="col"').replace(/<\/td>/g, '</th>');
          return match.replace(headerRow, headers);
        }
      }
      return match;
    });
  }

  // Ensure the returned content has proper accessibility attributes
  dependencyGraphContent.html = fixTableStructureIssues(dependencyGraphContent.html || '');
  dependencyGraphContent.svg = svg;

  return dependencyGraphContent;
}

// Accessibility: Updated indexFunction to use indexContent directly
// with proper accessibility attributes and semantic HTML
function indexFunction() {
  const { indexContent } = indexModule;

  // Render the index view
  const title = indexContent.title || 'Project Index';
  const navigation = indexContent.navigation || [];

  let navHtml = '<nav role="navigation" aria-label="Main navigation"><ul>';
  navigation.forEach((item) => {
    navHtml += `<li><a href="${item.url}">${item.label}</a></li>`;
  });
  navHtml += '</ul></nav>';

  const mainContent = `
    <header role="banner">
      <h1>${title}</h1>
    </header>
    <main role="main" id="main-content">
      ${navHtml}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading">Project Overview</h2>
        <p>Welcome to the project documentation index.</p>
      </section>
    </main>
    <footer role="contentinfo">
      <p>&copy; 2024 Project Team</p>
    </footer>
  `;

  indexContent.html = mainContent;

  return indexContent;
}

// Helper function to ensure lang attribute on HTML elements
function ensureLangAttribute(html) {
  if (html.includes('<html') && !html.includes('lang=')) {
    return html.replace('<html', '<html lang="en"');
  }
  return html;
}

// Helper function to ensure unique landmarks
function ensureUniqueLandmarks(html) {
  const landmarkIds = new Map();
  let counter = 0;
  const roles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];

  roles.forEach((role) => {
    const pattern = new RegExp(`<[^>]*role=["']${role}["'][^>]*>`, 'gi');
    html = html.replace(pattern, (match) => {
      if (match.includes('id=')) {
        return match;
      }
      counter++;
      const id = `${role}-${counter}`;
      return match.replace('>', ` id="${id}">`);
    });
  });

  return html;
}

// ... other functions and exports ...

// Added the required exports
module.exports = {
  dependencyGraphFunction,
  indexFunction,
  ensureLangAttribute,
  ensureUniqueLandmarks,
};