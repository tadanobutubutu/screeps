const main = require('./main');

// Accessibility function
function setSvgAccessibleProps(svg) {
  main.setSvgAttributes(svg);
  const titleElement = main.getSvgAccessibleName(svg);
  if (titleElement) {
    svg.setAttribute('aria-labelledby', titleElement.id);
  }
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

// Exporting merged code
module.exports = {
  ...main,
  setSvgAccessibleProps
};