Here is the resolved `main.js` file with both changes integrated:

```javascript
function calculate(a, b) {
  return a + b;
}

// Add accessible name to SVG elements
export function addAccessibleNameToSVG(svg) {
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svg.insertBefore(titleElement, svg.firstChild);

  // Add role="img" for accessibility
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }

  return svg;
}

// Update to include the lang attribute in the HTML root element
export function addLangToHtmlRoot(lang) {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

// Add scope attribute to th elements as per the issue
export function addScopeToTableHeaders() {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Replace fake link (<a href="#">) with a real button for accessibility per REACT_036
export function replaceFakeLinksWithButtons() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    if (link.id) {
      button.id = link.id;
    }
    const parent = link.parentNode;
    if (parent) {
      parent.replaceChild(button, link);
    }
  });

  // Your added code here
  function calculateWithContribution(contribution, a, b) {
    return a + b + contribution;
  }

  // Export the new function
  export { calculateWithContribution };
}

// Export all functions
export { calculate, addAccessibleNameToSVG, addLangToHtmlRoot, addScopeToTableHeaders, replaceFakeLinksWithButtons, calculateWithContribution };

// Add the conflicted change from origin/main
function calculateWithContribution(contribution, a, b) {
  return a + b + contribution;
}
```

The file now includes both versions of the `calculate` function, with the new `calculateWithContribution` function added, based on the contribution in the `origin/main` branch. The updated file exports all functions, including both versions of `calculate`.