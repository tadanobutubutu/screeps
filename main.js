let uniqueId = 0;
const links = document.links;

// Function to ensure accessibility improvements
const ensureAccessibility = (htmlContent) => {
  // Generate HTML with lang attribute for screen readers
  let accessibleHtml = generateHtmlWithLangAttribute('div', 'en');

  // Wrap in main tag for structural accessibility if content is provided
  if (htmlContent) {
    accessibleHtml = `<main>\n${accessibleHtml}\n${htmlContent}\n</main>`;
  }

  // Apply additional accessibility improvements
  for (let link of links) {
    if (link.hash === '') {
      link.setAttribute('aria-label', 'Link to ' + link.textContent);
      link.setAttribute('id', 'unique-link-' + uniqueId);
      uniqueId++;
    }
  }

  return accessibleHtml;
};

const fixAccessibilityIssues = () => {
  document.documentElement.lang = 'en'; // Set lang attribute based on page content
  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }
};

function printAlertMessages(messages) {
  messages.forEach((message) => {
    const alert = document.createElement('div');
    alert.className = 'alert';
    alert.textContent = message;
    document.body.appendChild(alert);
  });
}

function generateHtmlWithLangAttribute(tag, language = 'en', content = '') {
  const htmlWithLang = `<${tag} lang="${language}">${content}</${tag}>`;
  return htmlWithLang;
}

const App = () => {
  const mainContent = generateHtmlWithLangAttribute('div', 'en');
  const dependencyGraphContent = '';
  const indexContent = '';

  function renderDependencyGraph() {
    const graphData = {
      headers: ['Header1', 'Header2'],
      dependencies: [{ name: 'Dep1' }, { name: 'Dep2' }]
    };
    const table = document.createElement('table');

    graphData.headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.setAttribute('scope', 'col'); // Adding scope attribute as per REACT_027 issue
      table.appendChild(th);
    });

    graphData.dependencies.forEach(dependency => {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.textContent = dependency.name;
      tr.appendChild(td);
      table.appendChild(tr);
    });

    ensureAccessibility(table.outerHTML); // Replace ensureHtmlLangAttribute call

    // Replace the <a id="unrotate"> with a <button> for better accessibility
    const replaceUnrotateLink = () => {
      const anchor = document.getElementById('unrotate');
      if (anchor) {
        const button = document.createElement('button');
        button.id = 'unrotate';
        button.textContent = 'rotate back';
        button.onclick = () => {
          // Placeholder for rotateBack logic
          console.log('Rotate back clicked');
        };
        anchor.parentNode.replaceChild(button, anchor);
      }
    };

    // Ensure the replacement runs after the DOM is ready
    if (typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', replaceUnrotateLink);
    }

    return table;
  }

  fixAccessibilityIssues();
  printAlertMessages(['Message 1', 'Message 2']);

  return (
    <div className="app">
      <div id="dependencyGraph" className="dependencyGraph" role="documentsummary">
        {renderDependencyGraph()}
      </div>
      <main id="main-content" className="content" role="main">
        <div dangerouslySetInnerHTML={{ __html: indexContent }} />
      </main>
      <footer id="footnotes" className="footnotes" role="contentinfo">
        {/* Existing footer content */}
      </footer>
    </div>
  );
};

// Helper to ensure the document <html> element has a lang attribute (REACT_015)
export { ensureAccessibility, fixAccessibilityIssues, printAlertMessages, generateHtmlWithLangAttribute };
export default App;