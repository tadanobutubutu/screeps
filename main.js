// Utility for creating accessible SVG elements

/**
 * Renders an SVG with accessibility attributes for decorative icons
 * @param {Object} props - SVG props including children
 * @returns {JSX.Element} Accessible SVG element
 */
export const AccessibleSVG = ({ 
  children, 
  ariaLabel,
  decorative = false,
  ...props 
}) => {
  if (decorative) {
    return (
      <svg aria-hidden="true" focusable="false" {...props}>
        {children}
      </svg>
    );
  }
  
  return (
    <svg aria-label={ariaLabel} {...props}>
      {children}
    </svg>
  );
};

export default AccessibleSVG;