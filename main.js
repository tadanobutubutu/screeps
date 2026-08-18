// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root'));

// New function to handle main content rendering
export function renderMainContent(content) {
  return (
    <main>
      {content}
    </main>
  );
}

// Existing exports (preserved)
export const existingFunction = () => {
  // Some existing functionality
};

export const anotherExistingFunction = () => {
  // Another existing function
};

// New component for dashboard layout, updated to match the A11y improvements in the merged version
export function DashboardLayout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// New component for documentation pages, updated to match the A11y improvements in the merged version
export function DocPageLayout({ children }) {
  return (
    <main>
      <div className="container">
        {children}
      </div>
    </main>
  );
}

// Import and use the added accessible components from the merged version
import { AccessibleTable, AccessibleIcon, AccessibleIconWithTitle, MainContent, Navigation, SiteFooter, ActionButton, RealLink } from './accessibilityComponents';

// Main App Component with proper landmark structure and integration of the new accessible components
const App = () => {
  const tableData = [
    { header: 'Row 1', cell1: 'Data 1', cell2: 'Data 2' },
    { header: 'Row 2', cell1: 'Data 3', cell2: 'Data 4' },
  ];

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header role="banner">
        <nav aria-label="Site header">
          <AccessibleIcon label="Website Logo" />
          <Navigation links={navLinks} />
        </nav>
      </header>

      <MainContent>
        <h1>Accessible Content</h1>
        <AccessibleTable data={tableData} />
        <ActionButton onClick={() => console.log('clicked')}>
          Click Me
        </ActionButton>
      </MainContent>

      <SiteFooter />
    </div>
  );
};

export { App, renderMainContent, DashboardLayout, DocPageLayout };