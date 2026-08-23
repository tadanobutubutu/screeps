import React from 'react'; // Fix for REACT_015 - React Language Attribute
export const HtmlWrapper = ({ lang = 'en', children }) => (
  <html lang={lang}>
    {children}
  </html>
); // Fix for REACT_017 - React Landmarks
export const PageLayout = ({ children }) => (
  <>
    <header role="banner">
      <nav role="navigation" aria-label="Main">
        {/* Navigation content */}
      </nav>
    </header>
    {children}
  </>
);