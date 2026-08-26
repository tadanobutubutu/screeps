const fs = require('fs');
const path = require('path');

// File paths
const layoutTsx = path.join(process.cwd(), 'app/layout.tsx');
const dashboardLayoutTsx = path.join(process.cwd(), 'dashboard/app/layout.tsx');

/**
 * Add aria-hidden="true" to SVG elements in layout files
 * to fix React SVG Accessible Name issue (REACT_041)
 */
function addAriaHiddenToSvg(content) {
  // Match SVG tags and add aria-hidden="true" if not already present
  // This regex looks for <svg (with possible attributes) not followed by aria-hidden
  return content.replace(
    /<svg(?![^>]*aria-hidden)([^>]*)>/gi,
    '<svg aria-hidden="true"$1>'
  );
}

// Process app/layout.tsx
if (fs.existsSync(layoutTsx)) {
  let layoutContent = fs.readFileSync(layoutTsx, 'utf8');
  layoutContent = addAriaHiddenToSvg(layoutContent);
  fs.writeFileSync(layoutTsx, layoutContent, 'utf8');
  console.log('Fixed: app/layout.tsx');
} else {
  console.log('File not found: app/layout.tsx');
}

// Process dashboard/app/layout.tsx
if (fs.existsSync(dashboardLayoutTsx)) {
  let dashboardLayoutContent = fs.readFileSync(dashboardLayoutTsx, 'utf8');
  dashboardLayoutContent = addAriaHiddenToSvg(dashboardLayoutContent);
  fs.writeFileSync(dashboardLayoutTsx, dashboardLayoutContent, 'utf8');
  console.log('Fixed: dashboard/app/layout.tsx');
} else {
  console.log('File not found: dashboard/app/layout.tsx');
}

console.log('React SVG Accessible Name (REACT_041) fix complete!');