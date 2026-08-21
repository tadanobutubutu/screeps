// Assuming `main.js` is the entry point where you set up the DOM
document.addEventListener('DOMContentLoaded', () => {
  // Replace 'svgElementId' with the actual ID of the SVG element
  const svgElement = document.getElementById('svgElementId');

  // Check if the SVG element exists
  if (svgElement) {
    // Add 'aria-hidden="true"' to the SVG element to indicate it's decorative
    svgElement.setAttribute('aria-hidden', 'true');

    // Optionally, if you want to ensure the SVG is not read by screen readers
    // You can also add a title element inside the SVG for screen reader accessibility
    const title = document.createElement('title');
    title.textContent = 'Decorative Icon';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
});