// Main entry point for the Screeps bot repository
import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraphComponent from './components/DependencyGraphComponent';
import IndexComponent from './components/IndexComponent';

// Adding the new function to address the accessibility issue with React Language Attribute
function handleLanguageAttribute(element) {
  // Implementing the logic to handle the language attribute for accessibility
  // ...
}

export default DependencyGraphComponent;
export default IndexComponent;

function App() {
  return (
    <div>
      <DependencyGraphComponent handleLanguageAttribute={handleLanguageAttribute} />
      <IndexComponent handleLanguageAttribute={handleLanguageAttribute} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));