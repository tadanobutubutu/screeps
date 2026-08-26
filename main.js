import React from 'react';
import ReactDOM from 'react-dom';

// ... existing imports and functions from main.js

// Assuming you have a function to render the HTML content of the pages
function renderPageContent(pageContent) {
  return <div dangerouslySetInnerHTML={{ __html: pageContent }} />;
}

// Function to set the document language
export function setDocumentLanguage(lang = 'en') {
  document.documentElement.lang = lang;
}

// Component to render the index.html content
const IndexPage = () => {
  return (
    <main>
      {renderPageContent(/* ... content of index.html ... */)}
    </main>
  );
};

// Component to render the dependency-graph.html content
const DependencyGraphPage = () => {
  return (
    <main>
      {renderPageContent(/* ... content of dependency-graph.html ... */)}
    </main>
  );
};

// Render the pages
ReactDOM.render(<IndexPage />, document.getElementById('index-root'));
ReactDOM.render(<DependencyGraphPage />, document.getElementById('dependency-graph-root'));