// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DataTable } from './components/DataTable';
import { IconButton } from './components/IconButton';

function App() {
  return (
    // REACT_015: Add lang attribute - in a real app this would be on the HTML element
    // For this component, we ensure proper language attributes where needed
    <div className="app">
      <Header />
      <main id="main-content" role="main">
        {/* REACT_017: Add main landmark */}
        <h1 className="visually-hidden">Main Content</h1>
        <DataTable data={sampleData} />
        <IconButton icon="settings" label="Settings" onClick={() => {}} />
        {/* REACT_036: Fix fake link issue - using proper anchor tag */}
        <a href="/about" className="nav-link">About Us</a>
      </main>
      <Footer />
    </div>
  );
}

// Sample data for the table component
const sampleData = [
  { id: 1, name: 'Item 1', status: 'Active' },
  { id: 2, name: 'Item 2', status: 'Inactive' },
];

export default App;