// main.js
// [Your existing code remains unchanged]

// Add these new functions to handle SVG accessibility
function addSvgAccessibility(svgElement) {
  if (!svgElement.hasAttribute('aria-hidden') && !svgElement.querySelector('title')) {
    svgElement.setAttribute('aria-label', 'Application icon');
  }
}

// Initialize accessibility for all SVGs
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    addSvgAccessibility(svg);
  });
});

// [Rest of your existing code remains unchanged]

// Add <main> landmark to the affected files
// For example, in app/layout.tsx:
// <html lang="ja">
//     <head>
//         <style>{`
//   // ... existing styles ...
//         `}</style>
//     </head>
//     <body>
//         <main>
//             // ... existing content ...
//         </main>
//     </body>
// </html>

// Repeat the above <main> landmark addition for dashboard/app/layout.tsx, docs/dependency-graph.html, and docs/index.html