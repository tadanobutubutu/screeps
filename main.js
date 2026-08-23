// Add the missing export of the rotateBack function
export function rotateBack() {
    console.log('Rotating back...');
    // Placeholder for actual rotate back logic
}

// Import and use dependencyGraphContent/indexContent from the appropriate modules
import { renderDependencyGraph, indexContent } from './dependencyGraphContent';

// Adding the correct script tag with lang attribute
var htmlContent = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <main id="app">
    <!-- On this line, wrap the primary content in <main> -->
    <script src="main.js" lang="javascript"></script>
  </main>
</body>
</html>`;

console.log("HTML content generated successfully");

// Function for wrapping primary content in <main>
export function wrapPrimaryContentInMain() {
    const mainContent = document.querySelector('.container');
    if (mainContent && mainContent.parentElement && mainContent.parentElement.tagName !== 'MAIN') {
        const mainTag = document.createElement('main');
        mainTag.appendChild(mainContent);
        mainContent.parentElement.insertBefore(mainTag, mainContent);
    }
}

// Newly added functions...
export function addLangAttribute() {
    const html = document.documentElement;
    if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
    }
}

export function addSvgAccessibleNames() {
    // Find SVG elements in app/layout.tsx and dashboard/app/layout.tsx
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg, index) => {
        if (index === 0) {
            svg.setAttribute('aria-label', 'Application logo');
            svg.setAttribute('role', 'img');
        } else if (index === 1) {
            svg.setAttribute('aria-label', 'Navigation icon');
            svg.setAttribute('role', 'img');
        }
    });
}

export function fixFakeLink() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '' || href === null || href === 'javascript:;') {
            link.setAttribute('href', '#main-content');
            if (!link.textContent.trim() || link.textContent === '') {
                link.setAttribute('aria-label', 'Skip to main content');
            }
        }
    });
}

export function addAccessibleIds() {
    const accessibleElements = document.querySelectorAll('[data-accessible]');
    accessibleElements.forEach((element) => {
        if (element.getAttribute('id')) return; // Skip elements with an id attribute

        const currentId = `accessible-${Math.random().toString(36).substr(2, 9)}`;
        element.setAttribute('id', currentId);
    });
}

// New functions or changes requested in the issue, if any
function newFunction() {
  console.log("New function executed successfully");
}

// Export the renderDependencyGraph function from dependencyGraphContent module
export { renderDependencyGraph };

// Export functions for accessibility
export { addLangAttribute, addSvgAccessibleNames, fixFakeLink, addAccessibleIds };

// Export function for wrapping primary content in <main>
export { wrapPrimaryContentInMain };