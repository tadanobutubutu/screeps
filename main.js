// TODO: Address accessibility issues from insight report (REACT_025) and re-add removed exports
// Accessibility fix for REACT_025: Ensure unique landmarks

import React from 'react';

// Example landmark wrapper components
export const MainLandmark = ({ children, ...props }) => (
  <main role="main" {...props}>
    {children}
  </main>
);

export const NavLandmark = ({ children, label, ...props }) => (
  <nav role="navigation" aria-label={label || 'Main navigation'} {...props}>
    {children}
  </nav>
);

export const HeaderLandmark = ({ children, ...props }) => (
  <header role="banner" {...props}>
    {children}
  </header>
);

export const FooterLandmark = ({ children, ...props }) => (
  <footer role="contentinfo" {...props}>
    {children}
  </footer>
);

export const AsideLandmark = ({ children, label, ...props }) => (
  <aside role="complementary" aria-label={label} {...props}>
    {children}
  </aside>
);

// Section with accessible labeling
export const Section = ({ children, label, ...props }) => (
  <section aria-labelledby={label ? `${label}-heading` : undefined} {...props}>
    {children}
  </section>
);

export default {
  MainLandmark,
  NavLandmark,
  HeaderLandmark,
  FooterLandmark,
  AsideLandmark,
  Section,
};