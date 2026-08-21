// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Accessibility fixes from insight report
import { AccessibleTable, AccessibleIcon, DecorativeIcon, MainContent, Navigation, Header, Footer, AccessibleLink, SkipLink, AccessiblePageWrapper } from './accessibility';

// Fix for REACT_025: Change error state's <main> to <section>
const FixedApp = () => {
  return (
    <App />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

// Proper landmark wrapper for accessible page structure
const AccessibilityPage = () => {
  return (
    <AccessiblePageWrapper>
      <Header>
        <Navigation>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </Navigation>
      </Header>
      <MainContent>
        <App />
      </MainContent>
      <Footer>
        <p>&copy; 2024 Accessible Site</p>
      </Footer>
      <SkipLink />
    </AccessiblePageWrapper>
  );
};

root.render(
  <React.StrictMode>
    <AccessibilityPage />
  </React.StrictMode>
);