main.js
// SVG accessibility fixes applied
document.querySelectorAll('svg').forEach(svg => {
  if (svg.getAttribute('aria-hidden') === null) {
    svg.setAttribute('aria-hidden', 'true');
  }
});

// React 025 fix for multiple <main> landmarks
const mainElements = document.getElementsByTagName('main');
if (mainElements.length > 1) {
  Array.from(mainElements).slice(1).forEach((main, index) => {
    main.id = `main-${index + 1}`;
    main.setAttribute('role', 'region');
  });
}

// Existing app logic preserved
const { game } = require('screeps');
game.loop = (() => {
// ... rest of the app logic
})();