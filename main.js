// main.js - Main game loop entry point
module.exports = {
  loop: function() {
    // Main game loop logic
  },
  // New function to handle the table structure issue
  fixTableStructureIssues: function() {
    // Add scope attribute to th elements that are missing it
    const thElements = document.querySelectorAll('th');
    thElements.forEach((th) => {
      if (!th.getAttribute('scope')) {
        // Determine if header is in thead or tbody to set appropriate scope
        const parentRow = th.closest('tr');
        const parentSection = th.closest('thead') ? 'thead' : 'tbody';
        if (parentSection === 'thead') {
          th.setAttribute('scope', 'col');
        } else {
          // For tbody, determine if it's a row header or column header
          const rowIndex = parentRow ? Array.from(parentRow.parentNode.children).indexOf(parentRow) : -1;
          const cellIndex = parentRow ? Array.from(parentRow.children).indexOf(th) : -1;
          if (rowIndex === 0) {
            th.setAttribute('scope', 'row');
          } else if (cellIndex === 0) {
            th.setAttribute('scope', 'col');
          }
        }
      }
    });

    // Ensure tables have proper caption elements
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Data table';
        table.insertBefore(caption, table.firstChild);
      }
    });
  },

  // Ensure unique landmarks
  ensureUniqueLandmarks: function() {
    // Get all landmark elements
    const landmarks = {
      main: Array.from(document.querySelectorAll('main')),
      nav: Array.from(document.querySelectorAll('nav')),
      header: Array.from(document.querySelectorAll('header')),
      footer: Array.from(document.querySelectorAll('footer')),
      aside: Array.from(document.querySelectorAll('aside')),
      section: Array.from(document.querySelectorAll('section'))
    };

    // Add unique labels to duplicate landmarks and keep a single <main>
    Object.keys(landmarks).forEach((landmarkType) => {
      const elements = landmarks[landmarkType];
      if (elements.length > 1) {
        elements.forEach((element, index) => {
          if (landmarkType === 'main' && index > 0) {
            // Convert extra <main> elements to <section> so only one main landmark remains
            const section = document.createElement('section');
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i];
              section.setAttribute(attr.name, attr.value);
            }
            while (element.firstChild) {
              section.appendChild(element.firstChild);
            }
            if (element.parentNode) {
              element.parentNode.replaceChild(section, element);
            }
          } else {
            if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
              const label = `${landmarkType} ${index + 1}`;
              element.setAttribute('aria-label', label);
            }
          }
        });
      }
    });
  },

  // Add accessible name to SVGs
  addSvgAccessibleNames: function() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      // Add accessible name using aria-label if not present
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
      }
      // Add role="img" for better screen reader support
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  // Add aria-label to the 'myDiv' element
  addAriaLabelToMyDiv: function() {
    const myDiv = document.getElementById('myDiv');
    if (myDiv) {
      myDiv.setAttribute('aria-label', 'My div');
    }
  },

  // Set language attribute on HTML element
  setLangAttribute: function() {
    document.documentElement.lang = 'en';
  },

  // Fix fake link issue
  fixFakeLinkIssue: function() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      if (!link.hasAttribute('href')) {
        link.setAttribute('href', '#');
      }
    });
  }
};

// Execute functions after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const exports = module.exports;
  exports.setLangAttribute();
  exports.fixFakeLinkIssue();
  exports.fixTableStructureIssues();
  exports.ensureUniqueLandmarks();
  exports.addSvgAccessibleNames();
  exports.addAriaLabelToMyDiv();
});