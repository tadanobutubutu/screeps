import React from 'react';
import { createRoot } from 'react-dom/client';

// Error/Success Component from HEAD
const MyComponent = ({ hasError, errorMessage, successData }) => {
  return (
    <main>
      {hasError ? (
        <section>
          <p>Error: {errorMessage}</p>
        </section>
      ) : (
        <article>
          <h1>Success</h1>
          <p>{successData}</p>
        </article>
      )}
    </main>
  );
};

// Accessibility components from origin/main
const AccessibleTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
        <th scope="col">Column 3</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <th scope="row">{row.header}</th>
          <td>{row.cell1}</td>
          <td>{row.cell2}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AccessibleIcon = ({ label }) => (
  <svg role="img" aria-label={label} width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

const AccessibleIconWithTitle = ({ label }) => (
  <svg role="img" aria-labelledby="icon-title" width="24" height="24" viewBox="0 0 24 24">
    <title id="icon-title">{label}</title>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

const MainContent = ({ children }) => (
  <main id="main-content" role="main">
    {children}
  </main>
);

const Navigation = ({ links }) => (
  <nav aria-label="Main navigation">
    <ul>
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </nav>
);

const SiteFooter = () => (
  <footer role="contentinfo">
    <nav aria-label="Footer navigation">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </nav>
  </footer>
);

const ActionButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

const RealLink = ({ href, children }) => (
  <a href={href} role="button">
    {children}
  </a>
);

// Unified App component combining both changes
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
// (components are defined above, so no additional import needed)

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
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header role="banner">
        <nav aria-label="Site header">
          <AccessibleIcon label="Website Logo" />
          <Navigation links={navLinks} />
        </nav>
      </header>

      <MainContent>
        {/* Use MyComponent for error/success states */}
        {/* Example: Pass hasError, errorMessage, or successData props */}
        <MyComponent 
          hasError={false}
          successData="Everything is working!"
        />
        <AccessibleTable data={tableData} />
        <ActionButton onClick={() => console.log('clicked')}>
          Click Me
        </ActionButton>
      </MainContent>

      <SiteFooter />
    </div>
  );
};

export {
  App,
  MyComponent,
  AccessibleTable,
  AccessibleIcon,
  AccessibleIconWithTitle,
  MainContent,
  Navigation,
  SiteFooter,
  ActionButton,
  RealLink,
  renderMainContent,
  DashboardLayout,
  DocPageLayout
};

export default App;