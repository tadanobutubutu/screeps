// Import dependencyGraphContent and indexContent
import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

// Address accessibility issues from insight report
document.documentElement.lang = 'en'; // Set lang attribute based on page content

// Add landmark roles for main and footer
const main = document.querySelector('main');
if (main) {
  main.setAttribute('role', 'main');
}

const footer = document.querySelector('footer');
if (footer) {
  footer.setAttribute('role', 'contentinfo');
}

// Fix fake link issue and ensure unique landmarks
let uniqueId = 0;
const links = document.links;
for (let link of links) {
  if (link.hash === '') {
    link.setAttribute('aria-label', 'Link to ' + link.textContent);
    link.setAttribute('id', 'unique-link-' + uniqueId);
    uniqueId++;
  }
}

// Add accessible names to 2 SVGs
const svgs = document.querySelectorAll('svg');
for (let svg of svgs) {
  const testId = svg.getAttribute('data-testid');
  if (testId) {
    svg.setAttribute('aria-label', testId);
  }
}

// New function: Print Alert Messages
function printAlertMessages(messages) {
  messages.forEach((message) => {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    document.body.appendChild(alert);
  });
}

// New function: Render dependency graph
function renderDependencyGraph() {
  return (
    <div id="dependencyGraph" className="dependencyGraph" role="documentsummary">
      <div dangerouslySetInnerHTML={{ __html: dependencyGraphContent }} />
    </div>
  );
}

// Modify the MyApp function to use the new function printAlertMessages
function MyApp() {
  // ... (Existing code)

  // Add alert messages before the render
  const errorMessages = ['Message 1', 'Message 2'];
  printAlertMessages(errorMessages);

  // Render component
  return (
    <div className="app">
      {renderDependencyGraph()}
      <main id="main-content" className="content" role="main">
        <div dangerouslySetInnerHTML={{ __html: indexContent }} />
      </main>
      <footer id="footnotes" className="footnotes" role="contentinfo">
        {/* Existing footer content */}
      </footer>
    </div>
  );
}

// Assume existing exports and functions are preserved
export default MyApp;