import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function Navigation() {
  return (
    <div className="navigation">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#" onClick={() => console.log('clicked')}>Click me</a>
      <a href="https://example.com">External</a>
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <h1>My Application</h1>
      <Navigation />
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Related Links</h2>
      <a href="#section1">Section 1</a>
      <a href="#section2">Section 2</a>
    </div>
  );
}

function MainContent() {
  return (
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

function Footer() {
  return (
    <div className="footer">
      <p>&copy; 2024 My Application. All rights reserved.</p>
    </div>
  );
}

function AppLayout() {
  return (
    <div className="app-layout">
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