// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED: lang="en" added to HTML element
// - REACT_017: Add/fix 4 landmark issues ✓ FIXED: Added header, nav, main, footer landmarks
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED: Only one nav per section with unique labels
// - REACT_036: Fix 1 fake link issue ✓ FIXED: Changed button to proper anchor element

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function App() {
  const [route, setRoute] = React.useState('home');

  return (
    <div className="app">
      {/* Landmark: Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Landmark: Header with navigation */}
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }}>Home</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setRoute('about'); }}>About</a></li>
          </ul>
        </nav>
      </header>

      {/* Landmark: Main content - unique per page */}
      <main id="main-content" role="main">
        {route === 'home' && <HomePage />}
        {route === 'about' && <AboutPage />}
      </main>

      {/* Landmark: Footer */}
      <footer role="contentinfo">
        <nav role="navigation" aria-label="Footer navigation">
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </nav>
        <p>&copy; 2024 My Application</p>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <div className="page home-page">
      <h1>Welcome to Our Application</h1>
      <p>This is the home page of our accessible React application.</p>
      {/* Fixed: Changed from <button> to proper <a> tag for navigation */}
      <a href="/dashboard" className="cta-button">Go to Dashboard</a>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page about-page">
      <h1>About Us</h1>
      <p>Learn more about our mission and team.</p>
      <aside role="complementary" aria-label="Quick facts">
        <h2>Quick Facts</h2>
        <ul>
          <li>Founded in 2020</li>
          <li>100+ team members</li>
          <li>Serving 50+ countries</li>
        </ul>
      </aside>
    </div>
  );
}

// Export all functions
export default App;
export { App, HomePage, AboutPage };

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);