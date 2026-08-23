// Screeps bot main.js
module.exports = {
  loop: function() {
    // Game tick logic
    console.log('Game running');
  },
  // New function to fix the React SVG Accessible Name issue
  fixSVGAccessibleName: function(svgString) {
    // Check if the SVG string contains a text element without an accessible name
    if (/<text\b[^>]*>/i.test(svgString) && !/<title\b[^>]*>/i.test(svgString) && !/<svg\b[^>]*aria-label="[^"]*"[^>]*>/i.test(svgString) && !/<svg\b[^>]*aria-hidden="true"[^>]*>/i.test(svgString)) {
      // Add an aria-label attribute if it's decorative
      return svgString.replace(/<svg\b[^>]*>/i, '<svg $& aria-label="Decorative SVG">');
    }
    return svgString;
  }
};