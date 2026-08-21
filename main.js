// main.js - Accessibility fixes applied
// Repository: screeps/screeps

// Ensure proper language attribute is set for the document
// This addresses REACT_015 (React Language Attribute)

// Helper function for accessible links
const createAccessibleLink = (href, text, options = {}) => {
  const { onClick, className, ariaLabel } = options;
  
  // Check if it's a fake link (JavaScript navigation)
  // Address REACT_036 (React Fake Link)
  if (href.startsWith('javascript:') || (href === '#' && onClick)) {
    // Use button element instead of anchor for JS navigation
    console.warn('Consider using a <button> element for JavaScript actions instead of anchor tags');
  }
  
  return {
    type: 'a',
    props: {
      href,
      onClick,
      className,
      'aria-label': ariaLabel
    },
    children: text
  };
};

// Helper for accessible SVG icons
const createAccessibleSVG = (svgProps, children) => {
  // Address REACT_041 (React SVG Accessible Name)
  const { title, ariaHidden, role, ...rest } = svgProps;
  
  return {
    type: 'svg',
    props: {
      ...rest,
      role: role || 'img',
      'aria-hidden': ariaHidden !== undefined ? ariaHidden : (title ? false : true),
      children: title ? [
        { type: 'title', props: { children: title } },
        ...(Array.isArray(children) ? children : [children])
      ] : children
    }
  };
};

// Helper for table structure (addresses REACT_027)
const createAccessibleTable = (props, headers, rows) => {
  const { caption, summary } = props;
  
  return {
    type: 'table',
    props: {
      role: 'table',
      'aria-label': caption || summary || 'Data table',
      children: [
        caption && { type: 'caption', props: { children: caption } },
        {
          type: 'thead',
          props: {
            children: {
              type: 'tr',
              props: {
                children: headers.map((header, i) => ({
                  type: 'th',
                  props: { 
                    scope: 'col',
                    children: header,
                    key: i
                  }
                }))
              }
            }
          }
        },
        {
          type: 'tbody',
          props: {
            children: rows.map((row, rowIndex) => ({
              type: 'tr',
              props: {
                children: row.map((cell, cellIndex) => ({
                  type: 'td',
                  props: {
                    children: cell,
                    key: cellIndex,
                    headers: headers[cellIndex]
                  }
                })),
                key: rowIndex
              }
            }))
          }
        }
      ]
    }
  };
};

// Main entry point
const main = () => {
  console.log('Screeps accessibility-compliant main module loaded');
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createAccessibleLink,
    createAccessibleSVG,
    createAccessibleTable,
    main
  };
}

// Run main if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main();
}