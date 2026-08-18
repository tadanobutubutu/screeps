// ... (other code)

// Replace the <a> tag with a <button> tag
document.getElementById('unrotate').innerHTML = `
  <button id="unrotate" onClick="handleClick" type="button">rotate back</button>
`;

// Add aria-hidden to SVG elements in layout files
// This is a placeholder - in a real React app, you would modify the layout.tsx files directly
// For the purpose of this example, we'll add it to the DOM manipulation
document.querySelectorAll('svg').forEach(svg => {
  if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
    svg.setAttribute('aria-hidden', 'true');
  }
});

// ... (other code)