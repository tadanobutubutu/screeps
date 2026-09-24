// TODO: This is the existing code that needs to be preserved

/**
 * Adds SVG accessibility props to an element or returns modified props object
 * @param {Object} props - The props object to add accessibility attributes to
 * @param {Object} options - Accessibility options
 * @param {string} [options.label] - aria-label for the SVG
 * @param {string} [options.labelledBy] - aria-labelledby for the SVG
 * @param {boolean} [options.decorative=false] - Whether the SVG is purely decorative
 * @returns {Object} Modified props with accessibility attributes
 */
function addSVGAccessibilityProps(props, options = {}) {
  const {
    label,
    labelledBy,
    decorative = false,
  } = options;

  const accessibilityProps = {};

  if (decorative) {
    accessibilityProps['aria-hidden'] = 'true';
    accessibilityProps.focusable = 'false';
  } else {
    accessibilityProps.role = 'img';

    if (label) {
      accessibilityProps['aria-label'] = label;
    }

    if (labelledBy) {
      accessibilityProps['aria-labelledby'] = labelledBy;
    }

    // Ensure SVG is focusable for keyboard navigation
    accessibilityProps.tabIndex = props.tabIndex !== undefined ? props.tabIndex : 0;
  }

  return {
    ...props,
    ...accessibilityProps,
  };
}

module.exports = { addSVGAccessibilityProps };