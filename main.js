// Original main.js content
module.exports = {
  // ... other code ...

  // Code that needs to be updated for REACT_027 issue
  renderDependencyGraph: () => {
    const graphData = fetchGraphData();
    const table = document.createElement('table');

    // ... existing table setup code ...

    graphData.headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.setAttribute('scope', 'col'); // Adding scope attribute as per REACT_027 issue
      table.appendChild(th);
    });

    graphData.dependencies.forEach(dependency => {
      const tr = document.createElement('tr');

      // ... existing row setup code ...

      table.appendChild(tr);
    });

    // ... existing table append code ...

    // Fix for REACT_015: ensure document root has a lang attribute for accessibility
    ensureHtmlLangAttribute('en');

    return table;
  },

  // ... other code ...

  // Helper to ensure the document <html> element has a lang attribute (REACT_015)
  ensureHtmlLangAttribute: (lang = 'en') => {
    if (typeof document === 'undefined') return;
    const rootElement = document.documentElement;
    if (rootElement && !rootElement.getAttribute('lang')) {
      rootElement.setAttribute('lang', lang);
    }
  },
};