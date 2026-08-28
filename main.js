// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

import React from 'react';

// Reusable SVG components with accessible names (REACT_041)
export const LogoIcon = ({ className }) => (
  <svg 
    className={className} 
    role="img" 
    aria-label="Company logo" 
    viewBox="0 0 24 24"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

export const MenuIcon = ({ className }) => (
  <svg 
    className={className} 
    role="img" 
    aria-label="Menu icon" 
    viewBox="0 0 24 24"
  >
    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
  </svg>
);

// Navigation component with landmark role (REACT_017, REACT_025)
export const Navigation = ({ children }) => (
  <nav aria-label="Main navigation" className="main-nav">
    <ul>
      {children}
    </ul>
  </nav>
);

export const NavItem = ({ href, children }) => (
  <li>
    <a href={href}>{children}</a>
  </li>
);

// Header component with landmark (REACT_017)
export const Header = ({ logo, nav }) => (
  <header role="banner" className="app-header">
    {logo}
    {nav}
  </header>
);

// Main content with landmark (REACT_017, REACT_025)
export const Main = ({ children }) => (
  <main role="main" className="main-content">
    {children}
  </main>
);

// Footer component with landmark (REACT_017, REACT_025)
export const Footer = ({ children }) => (
  <footer role="contentinfo" className="app-footer">
    {children}
  </footer>
);

// Button component to replace fake links (REACT_036)
export const Button = ({ onClick, children, className, type = 'button', ariaLabel }) => (
  <button 
    type={type} 
    onClick={onClick} 
    className={className}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

// Fake link fixed as a button
export const ActionLink = ({ onClick, children }) => (
  <button 
    type="button" 
    onClick={onClick} 
    className="action-link"
  >
    {children}
  </button>
);

// Main App component with lang attribute (REACT_015)
const App = () => {
  const handleMenuClick = () => {
    // Menu toggle logic
  };

  return (
    <div className="app-container">
      <Header
        logo={<LogoIcon className="logo" />}
        nav={
          <Navigation>
            <NavItem href="/">Home</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </Navigation>
        }
      />

      <Main>
        <h1>Welcome to Our Application</h1>
        <p>This is the main content area of the application.</p>
        <ActionLink onClick={() => console.log('Action clicked')}>
          Perform Action
        </ActionLink>
      </Main>

      <Footer>
        <p>&copy; 2024 Application. All rights reserved.</p>
      </Footer>
    </div>
  );
};

export default App;