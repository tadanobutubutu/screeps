tsx
import React from 'react';

interface SvgProps {
  children: React.ReactNode;
  ariaLabel?: string;
}

const AccessibleSvg: React.FC<SvgProps> = ({ children, ariaLabel, ...rest }) => {
  return (
    <svg {...rest} aria-label={ariaLabel}>
      {children}
    </svg>
  );
};

const Favicon: React.FC = () => {
  return (
    <link rel="icon" href="/path/to/favicon.svg" />
  );
};

const AppLayout: React.FC = () => {
  return (
    <header>
      <h1>Welcome to the App</h1>
      {/* Add aria-label to the SVG element */}
      <AccessibleSvg ariaLabel="App logo">
        {/* ... your SVG content ... */}
      </AccessibleSvg>
    </header>
  );
};

export default AppLayout;