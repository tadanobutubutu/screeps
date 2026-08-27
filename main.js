import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function Navigation() {
  return (
    <nav className="navigation" role="navigation">
      <a href="#" aria-label="Home">Home</a>
      <a href="#" aria-label="About">About</a>
      <a href="#" aria-label="Click me" onClick={() => console.log('clicked')}>Click me</a>
      <a href="https://example.com" aria-label="External link">External</a>
    </nav>
  );
}

function Header() {
  return (
    <header className="header" role="banner">
      <h1>My Application</h1>
      <Navigation />
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar" role="complementary">
      <h2>Related Links</h2>
      <a href="#section1" aria-label="Section 1">Section 1</a>
      <a href="#section2" aria-label="Section 2">Section 2</a>
    </aside>
  );
}

function MainContent() {
  return (
    <main className="main-content" role="main">
      <section>
        <h2>Welcome</h2>
        <p>This is the main content area of the application.</p>
      </section>
      <section>
        <h2>Features</h2>
        <p>Discover our amazing features.</p>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <p>&copy; 2024 My Application. All rights reserved.</p>
    </footer>
  );
}

function AppLayout() {
  return (
    <div className="app-layout" role="document">
      <Header />
      <MainContent />
      <Sidebar />
      <Footer />
    </div>
  );
}

function AccessibilityWrapper({ children }) {
  return (
    <div role="application" aria-label="main application">
      {children}
    </div>
  );
}

function Root() {
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