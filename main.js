import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Wrap the primary content in a <main> element to provide a landmarks for screen readers.
// This addresses the "React Landmarks (4 occurrences)" issue (REACT_017).
function MainWithLandmark() {
  return <main><App /></main>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainWithLandmark />);

export default App;