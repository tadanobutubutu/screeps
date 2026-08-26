import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// REACT_036: Fix fake link issue - links with href="#" should be buttons
// REACT_015: Add lang attribute to HTML element
// REACT_017: Add/fix landmark issues - ensure proper landmark elements
// REACT_025: Ensure unique landmarks

export function Navigation() {
  return (
    // REACT_017: Navigation should use <nav> landmark
    // Issue: Missing proper nav landmark
    <div className="navigation">
      <a href="#">Home</a>
      <a href="#">About</a>
      {/* REACT_036: This is a fake link - should be a button */}
      <a href="#" onClick={() => console.log('clicked')}>Click me</a>
      <a href="#">Contact</a>
    </div>
  );
}

export function Header() {
  return (
    // REACT_017: Header should use <header> landmark
    // Issue: Using div instead of header
    <div className="header">
      <h1>My Application</h1>
      <Navigation />
    </div>
  );
}

export function Sidebar() {
  return (
    // REACT_017: Sidebar should use <aside> landmark
    // Issue: Missing aside landmark for complementary content
    <div className="sidebar">
      <h2>Related Links</h2>
      <a href="#section1">Section 1</a>
      <a href="#section2">Section 2</a>
    </div>
  );
}

export function MainContent() {
  return (
    // REACT_017: Main content should use <main> landmark
    // Issue: Missing main landmark
    // REACT_025: Ensure only one main landmark exists
    <div className="main-content">
      <section>
        <h2>Welcome</h2>
        <p>This is the main content area of the application.</p>
      </section>
      <section>
        <h2>Features</h2>
        <p>Discover our amazing features.</p>
      </section>
    </div>
  );
}

export function Footer() {
  return (
    // REACT_017: Footer should use <footer> landmark
    // Issue: Using div instead of footer
    <div className="footer">
      <p>&copy; 2024 My Application. All rights reserved.</p>
    </div>
  );
}

export function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <MainContent />
      <Sidebar />
      <Footer />
    </div>
  );
}

// Wrap App in accessibility-focused container
export function AccessibilityWrapper({ children }) {
  // REACT_015: lang attribute should be on HTML element (typically set in index.html)
  // This component ensures accessibility attributes are properly managed
  return (
    <div role="application" aria-label="main application">
      {children}
    </div>
  );
}

// REACT_025: Demo of duplicate landmark issue - this would be in separate components
// Uncomment to see the duplicate main issue:
// function DuplicateMain() {
//   return (
//     <main>
//       <p>This is a duplicate main landmark (accessibility violation)</p>
//     </main>
//   );
// }

// Main render function with accessibility improvements
export function Root() {
  return (
    <React.StrictMode>
      <AccessibilityWrapper>
        <AppLayout />
      </AccessibilityWrapper>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();