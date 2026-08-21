// Add lang attribute to document if missing
if (typeof document !== 'undefined' && document.documentElement) {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Export existing functionality (placeholder - replace with actual exports)
export const existingFunction = () => {
  // Your existing function logic
};

// Helper function to generate unique IDs for elements
let idCounter = 0;
const generateUniqueId = (prefix = 'element') => {
  return `${prefix}-${Date.now()}-${idCounter++}`;
};

// Enhanced table component with proper structure
export const AccessibleTable = ({ headers, rows }) => {
  const tableId = generateUniqueId('table');
  const captionId = `${tableId}-caption`;
  
  return (
    <table id={tableId} aria-label="Data table">
      {headers && headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col">{header}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {rows && rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Accessible SVG component with title
export const AccessibleSVG = ({ paths, title, description, ...props }) => {
  const svgId = generateUniqueId('svg');
  const titleId = `${svgId}-title`;
  const descId = `${svgId}-desc`;
  
  return (
    <svg 
      role="img"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      {...props}
    >
      {title && (
        <title id={titleId}>{title}</title>
      )}
      {description && (
        <desc id={descId}>{description}</desc>
      )}
      {paths && paths.map((path, index) => (
        <path key={index} d={path.d} {...path.props} />
      ))}
    </svg>
  );
};

// Landmark components for better navigation
export const MainContent = ({ children, label = "Main content" }) => {
  return (
    <main aria-label={label}>
      {children}
    </main>
  );
};

export const Navigation = ({ children, label = "Navigation" }) => {
  return (
    <nav aria-label={label}>
      {children}
    </nav>
  );
};

export const SearchForm = ({ ...props }) => {
  return (
    <form role="search" aria-label="Site search" {...props} />
  );
};

// Enhanced link component to prevent fake links
export const AccessibleLink = ({ href, onClick, children, ...props }) => {
  const handleClick = (e) => {
    if (!href && onClick) {
      // If no href but has onClick, ensure it's properly accessible
      e.preventDefault();
      onClick(e);
    }
  };

  if (href) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  // Convert fake links to buttons when possible
  return (
    <button 
      type="button"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Ensure unique landmark labels
const usedLandmarkLabels = new Set();

export const UniqueLandmark = ({ type, label, children, ...props }) => {
  let uniqueLabel = label;
  if (usedLandmarkLabels.has(label)) {
    let counter = 1;
    while (usedLandmarkLabels.has(`${label}-${counter}`)) {
      counter++;
    }
    uniqueLabel = `${label}-${counter}`;
  }
  usedLandmarkLabels.add(uniqueLabel);

  const landmarkProps = {
    [type]: true,
    'aria-label': uniqueLabel,
    ...props
  };

  const Tag = type;
  return <Tag {...landmarkProps}>{children}</Tag>;
};

// Reset landmark labels (call when unmounting components)
export const resetLandmarkLabels = () => {
  usedLandmarkLabels.clear();
};

// Your existing code continues here...
// Make sure to preserve all existing exports and functionality