// Assuming you have a component that renders the HTML content from 'docs/dependency-graph.html'
import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // This line imports the HTML file

function App() {
  return (
    <div>
      {/* Render the HTML content with the lang attribute */}
      <div dangerouslySetInnerHTML={{ __html: document.documentElement.outerHTML.replace(/<html>/g, '<html lang="en">') }} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));