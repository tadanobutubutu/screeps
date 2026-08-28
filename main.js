// TODO: Implement this function for adding SVG accessibility props
function addSvgAccessibilityProps(svgElement, options = {}) {
  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    focusable = false,
    tabIndex
  } = options;

  if (role && !svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', role);
  }

  if (ariaLabel && !svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', ariaLabel);
  }

  if (ariaLabelledby && !svgElement.getAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-labelledby', ariaLabelledby);
  }

  if (ariaDescribedby && !svgElement.getAttribute('aria-describedby')) {
    svgElement.setAttribute('aria-describedby', ariaDescribedby);
  }

  if (typeof focusable === 'boolean' && !svgElement.hasAttribute('focusable')) {
    svgElement.setAttribute('focusable', focusable.toString());
  }

  if (tabIndex !== undefined && !svgElement.hasAttribute('tabindex')) {
    svgElement.setAttribute('tabindex', tabIndex);
  }

  return svgElement;
}

module.exports = { addSvgAccessibilityProps };