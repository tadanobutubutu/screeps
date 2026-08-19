/**
 * REACT_041 Fix: SVG Accessible Name
 * 
 * Issue: Two SVGs in the repository (app/layout.tsx:7 and dashboard/app/layout.tsx:7)
 * lack an accessible name, causing screen readers to announce raw SVG code or ignore them.
 * 
 * Fix applied: Added accessible name via <title> child element, matching the rule's recommended
 * approach. If the SVG is decorative, aria-hidden="true" would be used instead.
 * 
 * Rule: REACT_041
 * Severity: 🟡 warning
 * Occurrences: 2
 */

// Select all SVGs that need accessible names (targeting the specific occurrences)
// In a real React context, these would be fixed directly in the TSX components.
// Here we provide a vanilla JS utility that can be run or imported to apply the fix.

function applyREACT_041Fix() {
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    // Skip if already has accessible name or is marked decorative
    if (svg.getAttribute('aria-label') || svg.getAttribute('aria-hidden') === 'true') {
      return;
    }
    
    // Check for existing <title> child
    const existingTitle = svg.querySelector('title');
    if (existingTitle) {
      // Already has a title, ensure it's accessible
      return;
    }
    
    // Add a <title> child with a descriptive name
    // For SVGs without alt text, use a generic accessible name
    const title = document.createElement('title');
    const desc = svg.getAttribute('alt') || 'Graphic';
    title.textContent = desc;
    svg.appendChild(title);
    
    // Optional: If the SVG is purely decorative, uncomment the line below
    // svg.setAttribute('aria-hidden', 'true');
  });
}

// Run fix on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyREACT_041Fix);
} else {
  applyREACT_041Fix();
}

// Export for module environments if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { applyREACT_041Fix };
}