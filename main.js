import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Favicon from './favicon.svg';

// ---------------------------------------------------------------------------
// ️⃣ Fix for REACT_041 – SVG Accessible Name
// The favicon SVG previously had no accessible name, causing screen readers
// to announce raw SVG markup or ignore it. Adding `aria-hidden="true"` (or a
// <title> element) marks it as decorative and prevents confusing announcements.
// ---------------------------------------------------------------------------

function App() {
  return (
    <>
      {/* 👉 Updated SVG usage – hidden from accessibility tools */}
      <Favicon aria-hidden="true" focusable="false" role="presentation" />

      {/* Existing application markup */}
      <div id="root"></div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;