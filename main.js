// Import the HTML file or component that corresponds to 'docs/dependency-graph.html'
import DependencyGraphHTML from './docs/dependency-graph.html';

// A hypothetical function that might be responsible for rendering the HTML content
function renderHTMLContent() {
  return (
    <div>
      {/* Render the DependencyGraphHTML component or use the raw HTML */}
      <DependencyGraphHTML />
    </div>
  );
}

// Render the HTML content somewhere in your application
export default function App() {
  return renderHTMLContent();
}