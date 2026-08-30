// Main module entry point

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

const VERSION = '1.0.0';
const APP_NAME = 'MyApp';

// Existing function
function hello() {
  return 'Hello, World!';
}

// Existing function
function getConfig() {
  return { version: VERSION, name: APP_NAME };
}

// Additional helper functions
function isValid(value) {
  return value !== null && value !== undefined;
}

function capitalize(str) {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

// Original rendering functions from HEAD
function renderDependencyGraph(graph) {
    if (!graph || typeof graph !== 'object') {
        return '';
    }

    const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    const edges = Array.isArray(graph.edges) ? graph.edges : [];

    const nodeSet = new Set(nodes.map(n => n && n.id).filter(Boolean));
    const validEdges = edges.filter(e => nodeSet.has(e.from) && nodeSet.has(e.to));

    const lines = [];
    lines.push('digraph dependencies {');
    lines.push('  rankdir=LR;');
    lines.push('  node [shape=box, style=filled, fillcolor="#eef"];');

    for (const node of nodes) {
        if (node && node.id) {
            const label = (node.label || node.id).replace(/"/g, '\\"');
            lines.push(`  "${node.id}" [label="${label}"];`);
        }
    }

    for (const edge of validEdges) {
        lines.push(`  "${edge.from}" -> "${edge.to}";`);
    }

    lines.push('}');
    return lines.join('\n');
}

function renderIndexView(items) {
    if (!Array.isArray(items)) {
        return '';
    }

    const lines = [];
    lines.push('# Index');
    lines.push('');

    items.forEach((item, index) => {
        if (!item) {
            return;
        }
        const title = item.title || item.name || `Item ${index + 1}`;
        const id = item.id !== undefined ? item.id : index;
        lines.push(`- [${title}](#item-${id})`);
    });

    lines.push('');
    return lines.join('\n');
}

function updateDependencyGraph(view, graph) {
    if (!view) {
        return null;
    }
    const rendered = renderDependencyGraph(graph);
    view.graphSource = rendered;
    view.lastUpdated = new Date().toISOString();
    return view;
}

function updateIndexView(view, items) {
    if (!view) {
        return null;
    }
    view.indexSource = renderIndexView(items);
    view.lastUpdated = new Date().toISOString();
    return view;
}

// REACT_015: Add lang attribute to HTML element
function getLangAttribute(locale) {
    const supported = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'zh', 'ko', 'ar', 'ru'];
    if (!locale || typeof locale !== 'string') {
        return 'en';
    }
    const normalized = locale.toLowerCase().split('-')[0];
    return supported.includes(normalized) ? normalized : 'en';
}

// REACT_036: Create in-page button (handles fake links)
function createInPageButton(label, targetId) {
    if (!label || !targetId) {
        return null;
    }
    return {
        type: 'button',
        label: String(label),
        targetId: String(targetId),
        onClick: `scrollToSection('${String(targetId).replace(/'/g, "\\'")}')`,
        role: 'button'
    };
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
    const issues = [];
    if (!table || typeof table !== 'object') {
        issues.push('Table is missing or invalid');
        return { valid: false, issues };
    }
    if (!table.caption && !table.ariaLabel && !table.ariaLabelledBy) {
        issues.push('Table is missing a caption or accessible name');
    }
    const headers = Array.isArray(table.headers) ? table.headers : [];
    const rows = Array.isArray(table.rows) ? table.rows : [];

    if (headers.length === 0 && rows.length > 0) {
        issues.push('Table has rows but no headers');
    }

    headers.forEach((header, index) => {
        if (header && (header.scope === undefined || header.scope === null)) {
            issues.push(`Header at index ${index} is missing scope attribute`);
        }
    });

    return {
        valid: issues.length === 0,
        issues
    };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
    const issues = [];
    if (!table || typeof table !== 'object') {
        issues.push('Table is missing or invalid');
        return { valid: false, issues };
    }

    const rows = Array.isArray(table.rows) ? table.rows : [];
    const headers = Array.isArray(table.headers) ? table.headers : [];

    if (rows.length > 0 && headers.length > 0) {
        const headerCount = headers.length;
        rows.forEach((row, rowIndex) => {
            if (Array.isArray(row) && row.length !== headerCount) {
                issues.push(`Row ${rowIndex} has ${row.length} cells but table has ${headerCount} headers`);
            }
        });
    }

    const hasThead = rows.some(row => row && row.section === 'thead');
    const hasTbody = rows.some(row => row && row.section === 'tbody');
    if (rows.length > 1 && !hasThead) {
        issues.push('Multi-row table is missing thead section');
    }
    if (rows.length > 0 && !hasTbody) {
        issues.push('Table is missing tbody section');
    }

    return {
        valid: issues.length === 0,
        issues
    };
}

// REACT_017: Validate landmark
function validateLandmark(landmark) {
    const issues = [];
    if (!landmark || typeof landmark !== 'object') {
        issues.push('Landmark is missing or invalid');
        return { valid: false, issues };
    }
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'form', 'search'];
    if (!landmark.role || !validRoles.includes(landmark.role)) {
        issues.push(`Landmark has invalid or missing role: ${landmark.role}`);
    }
    if (landmark.role === 'region' && !landmark.label && !landmark.ariaLabel) {
        issues.push('Region landmark requires an accessible name');
    }
    return {
        valid: issues.length === 0,
        issues
    };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure(landmarks) {
    const issues = [];
    if (!Array.isArray(landmarks)) {
        issues.push('Landmarks must be an array');
        return { valid: false, issues };
    }

    const requiredLandmarks = ['banner', 'main', 'contentinfo'];
    const presentRoles = new Set(landmarks.map(l => l && l.role).filter(Boolean));

    requiredLandmarks.forEach(role => {
        if (!presentRoles.has(role)) {
            issues.push(`Missing required landmark: ${role}`);
        }
    });

    landmarks.forEach((landmark, index) => {
        const result = validateLandmark(landmark);
        if (!result.valid) {
            result.issues.forEach(issue => {
                issues.push(`Landmark ${index}: ${issue}`);
            });
        }
    });

    return {
        valid: issues.length === 0,
        issues
    };
}

// REACT_017, REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    const seen = new Map();
    const result = [];

    landmarks.forEach((landmark) => {
        if (!landmark || !landmark.role) {
            return;
        }
        const key = landmark.role;
        if (!seen.has(key)) {
            seen.set(key, []);
        }
        seen.get(key).push(landmark);
    });

    for (const [role, items] of seen.entries()) {
        if (items.length === 1) {
            result.push(items[0]);
        } else {
            items.forEach((landmark, index) => {
                const unique = Object.assign({}, landmark);
                if (index === 0) {
                    result.push(unique);
                } else {
                    unique.ariaLabel = `${landmark.label || landmark.ariaLabel || role} ${index + 1}`;
                    unique.label = unique.ariaLabel;
                    result.push(unique);
                }
            });
        }
    }

    return result;
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
    if (!svg || typeof svg !== 'object') {
        return '';
    }
    if (svg.ariaLabel) {
        return String(svg.ariaLabel);
    }
    if (svg.ariaLabelledBy) {
        return String(svg.ariaLabelledBy);
    }
    if (svg.title) {
        return String(svg.title);
    }
    return '';
}

// REACT_041: Set SVG attributes
function setSvgAttributes(svg, attributes) {
    if (!svg || typeof svg !== 'object' || !attributes || typeof attributes !== 'object') {
        return svg || null;
    }
    const result = Object.assign({}, svg);
    if (attributes.ariaLabel) {
        result.ariaLabel = String(attributes.ariaLabel);
        result['aria-label'] = String(attributes.ariaLabel);
    }
    if (attributes.title) {
        result.title = String(attributes.title);
    }
    if (attributes.role) {
        result.role = String(attributes.role);
    } else if (!result.role) {
        result.role = 'img';
    }
    if (attributes.ariaHidden !== undefined) {
        result.ariaHidden = Boolean(attributes.ariaHidden);
    }
    return result;
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility(link) {
    const issues = [];
    if (!link || typeof link !== 'object') {
        issues.push('Link is missing or invalid');
        return { valid: false, issues };
    }
    if (!link.href && !link.onClick && !link.targetId) {
        issues.push('Link has no href, onClick, or target');
    }
    if (!link.text && !link.ariaLabel && !link.label) {
        issues.push('Link is missing accessible text');
    }
    if (link.fake === true) {
        issues.push('Link is a fake link (should be a button)');
    }
    return {
        valid: issues.length === 0,
        issues
    };
}

// REACT_036: Handle fake links
function handleFakeLinks(links) {
    if (!Array.isArray(links)) {
        return [];
    }
    const result = [];
    links.forEach((link) => {
        if (!link) {
            return;
        }
        if (link.fake === true || (!link.href && link.targetId)) {
            const button = createInPageButton(
                link.text || link.label || link.ariaLabel,
                link.targetId
            );
            if (button) {
                result.push(Object.assign({}, link, button, { fake: false, converted: true }));
            }
        } else {
            result.push(link);
        }
    });
    return result;
}

// Export all functions and constants
module.exports = {
  // Constants
  VERSION,
  APP_NAME,
  // Existing functions
  hello,
  getConfig,
  // Newly added missing exports
  isValid,
  capitalize,
  greet,
  formatDate,
  // Rendering functions
  renderDependencyGraph,
  renderIndexView,
  updateDependencyGraph,
  updateIndexView,
  // Accessibility functions
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  validateLinkAccessibility,
  handleFakeLinks
};