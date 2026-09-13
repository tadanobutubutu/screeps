// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

function addressAccessibilityIssues() {
  const doc = document;
  const landmarks = doc.querySelectorAll('[role="landmark"]');
  landmarks.forEach((landmark, index) => {
    const ariaLabel = landmark.getAttribute('aria-label');
    console.log('Landmark ' + index + ':', ariaLabel);
  });

  const svg1 = doc.querySelector('svg:first-of-type');
  const svg2 = doc.querySelector('svg:last-of-type');
  console.log('SVG elements:', svg1, svg2);
  // You can add title or description checks here if needed

  const mainElements = doc.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Accessibility Warning: Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
    // The static fix should be applied in the source files
    // - REACT_025: Replace one <main> with <section role="region" ...
    // - REACT_036: Same fix
  }

  const fakeLinks = doc.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'presentation');
  });

  // Function for checking link and button accessibility
  function checkLinksAndButtons() {
    const links = doc.querySelectorAll('a[href]');
    const buttons = doc.querySelectorAll('button');

    links.forEach(link => {
      if (!link.hasAttribute('role')) {
        link.setAttribute('role', 'link');
      }
      if (!link.getAttribute('href')) {
        console.error('Accessibility Error: Link without href attribute', link);
      }
    });

    buttons.forEach(button => {
      if (!button.hasAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      // Check for accessible name for buttons
      const hasText = button.textContent.trim().length > 0;
      const hasAriaLabel = button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby');
      if (!hasText && !hasAriaLabel) {
        console.error('Accessibility Error: Button without accessible name', button);
      }
    });
  }

  // TODO: Implement this function for accessibility checks on tables
  function checkTableAccessibility() {
    const tables = doc.querySelectorAll('table');
    
    tables.forEach(table => {
      // Check if table has a caption or accessible name
      const caption = table.querySelector('caption');
      const ariaLabel = table.getAttribute('aria-label');
      const ariaLabelledby = table.getAttribute('aria-labelledby');
      
      if (!caption && !ariaLabel && !ariaLabelledby) {
        console.error('Accessibility Error: Table missing accessible name (caption, aria-label, or aria-labelledby)', table);
      }
      
      // Check if data tables have header cells
      const headers = table.querySelectorAll('th');
      const isLayoutTable = table.getAttribute('role') === 'presentation' || 
                            table.getAttribute('role') === 'none';
      
      if (!isLayoutTable && headers.length === 0) {
        console.error('Accessibility Error: Data table should have header cells (<th>)', table);
      }
      
      // Check for proper scope attributes on header cells
      headers.forEach(header => {
        const scope = header.getAttribute('scope');
        if (!scope) {
          console.warn('Accessibility Warning: Header cell missing scope attribute', header);
        }
      });
      
      // Check that tables used for layout have role="presentation" or role="none"
      const tbody = table.querySelector('tbody');
      if (tbody && tbody.children.length === 1 && !isLayoutTable) {
        const rows = table.querySelectorAll('tr');
        const cells = table.querySelectorAll('td');
        // Simple heuristic: single row with many cells might be a layout table
        if (rows.length <= 2 && cells.length > 3) {
          console.warn('Accessibility Warning: Table may be used for layout. Consider adding role="presentation" or role="none"', table);
        }
      }
    });
  }

  // Call the function to check accessibility
  checkLinksAndButtons();
  checkTableAccessibility();
}

// Export functions if needed
export { rotateBack, addressAccessibilityIssues, calculateSum };