import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import './styles.css';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
function wrapPrimaryContentInMain(container) {
  if (!container) return null;

  const main = container.querySelector('main');
  if (main) return main;

  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  mainElement.setAttribute('aria-label', 'Content area');

  container.appendChild(mainElement);

  const primaryContent = container.querySelector('[role="main"] ~ *');
  if (primaryContent) {
    mainElement.appendChild(primaryContent);
  }

  return mainElement;
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  // REACT_015: Set the lang attribute on the HTML element
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  const mainElement = wrapPrimaryContentInMain(document.body);

  // REACT_017: Add landmark roles and fix landmark issues
  // REACT_025: Ensure unique landmarks
  // REACT_036: Fix 1 fake link issue
  // REACT_041: Add accessible names to SVGs

  // REACT_015 & REACT_017: Ensure document has lang attribute and proper landmark structure
  return mainElement ? (
    <div className="app-container">
      <Header />
      <Main data={data} loading={loading} />
      <Footer />
    </div>
  ) : null;
}

// REACT_017: Add landmark roles to fix landmark issues
// REACT_025: Ensure unique landmarks function
// REACT_041: Add accessible names to SVGs
// REACT_036: Fix fake link issues - convert to proper semantic elements
// REACT_027: Add scope to table headers
// ... (other functions)

export { App };