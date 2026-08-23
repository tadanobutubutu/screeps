const addLangAttribute = () => { 
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

const addAccessibleNamesToSVGs = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG';
      svg.insertBefore(titleElement, svg.firstChild);

      const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
      titleElement.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
};

const addScopeToTableHeaders = () => {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      const parentRow = header.closest('tr');
      const parentThead = header.closest('thead');
      const isFirstCell = parentRow && parentRow.querySelector('td') === header;
      
      if (parentThead) {
        header.setAttribute('scope', 'col');
      } else if (isFirstCell) {
        header.setAttribute('scope', 'row');
      }
    }
  });
};

const rotateBack = () => {
  console.log('Rotate back action triggered');
};

const validateAndFixTableStructure = () => {
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const hasCaption = table.querySelector('caption');
    const headers = table.querySelectorAll('th');
    const hasHeaders = headers.length > 0;

    if (!hasCaption && hasHeaders) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table description';
      table.insertBefore(caption, table.firstChild);
    }

    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      let hasThead = table.querySelector('thead');
      let hasTbody = table.querySelector('tbody');
      let hasTfoot = table.querySelector('tfoot');

      if (!hasThead) {
        const firstRow = rows[0];
        const firstRowHeaders = firstRow.querySelectorAll('th');
        const firstRowHasHeaders = firstRowHeaders.length > 0;

        if (firstRowHasHeaders) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow);
          table.insertBefore(thead, table.firstChild);
        }
      }

      if (!hasTbody && rows.length > 1) {
        const tbody = document.createElement('tbody');
        for (let i = 1; i < rows.length; i++) {
          const isInTfoot = rows[i].closest('tfoot');
          if (!isInTfoot) {
            tbody.appendChild(rows[i]);
          }
        }
        if (tbody.children.length > 0) {
          table.appendChild(tbody);
        }
      }

      const allCells = table.querySelectorAll('th, td');
      allCells.forEach(cell => {
        const headersAttr = cell.getAttribute('headers');
        if (headersAttr) {
          const headerIds = headersAttr.split(' ');
          headerIds.forEach(headerId => {
            const header = document.getElementById(headerId);
            if (!header) {
              cell.removeAttribute('headers');
            }
          });
        }
      });
    }

    addScopeToTableHeaders();
  });
};

const fixFakeLink = () => {
  const link = document.querySelector('a[href="#"]');
  if (!link) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.id = link.id;
  button.textContent = link.textContent;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    if (typeof rotateBack === 'function') {
      rotateBack();
    }
  });

  link.parentNode.replaceChild(button, link);
};

const wrapPrimaryContentInMain = () => {
  const existingMain = document.querySelector('main');
  if (existingMain) return;

  const primaryContentSelectors = [
    '#primary-content',
    '#main-content',
    '#content',
    '.primary-content',
    '.main-content',
    '[role="main"]'
  ];

  let primaryContent = null;
  for (const selector of primaryContentSelectors) {
    const element = document.querySelector(selector);
    if (element && !element.closest('main')) {
      primaryContent = element;
      break;
    }
  }

  if (!primaryContent) {
    const bodyChildren = document.body.children;
    const headerElements = document.querySelectorAll('header, nav, .hero, .banner');

    for (const child of bodyChildren) {
      const isHeader = Array.from(headerElements).some(header =>
        header.contains(child) || header === child
      );

      if (!isHeader && child.textContent.trim() && child.tagName !== 'SCRIPT') {
        const tagName = child.tagName;
        if (!['NAV', 'ASIDE', 'FOOTER', 'HEADER'].includes(tagName)) {
          primaryContent = child;
          break;
        }
      }
    }
  }

  if (primaryContent) {
    const mainElement = document.createElement('main');
    const parent = primaryContent.parentNode;
    if (parent) {
      parent.insertBefore(mainElement, primaryContent);
      mainElement.appendChild(primaryContent);
    }
  }
};

const fixLandmarkIssues = () => {
  let banner = document.querySelector('[role="banner"]');
  if (!banner) {
    const header = document.querySelector('header');
    if (header) {
      header.setAttribute('role', 'banner');
      banner = header;
    }
  }

  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.hasAttribute('role') || nav.getAttribute('role') !== 'navigation') {
      nav.setAttribute('role', 'navigation');
    }
  });

  let contentinfo = document.querySelector('[role="contentinfo"]');
  if (!contentinfo) {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.setAttribute('role', 'contentinfo');
      contentinfo = footer;
    }
  }

  let mainElement = document.querySelector('main');
  if (mainElement) {
    if (!mainElement.hasAttribute('role') || mainElement.getAttribute('role') !== 'main') {
      mainElement.setAttribute('role', 'main');
    }
  }
};

export { class1, function1, Object1, unique, addLangAttribute, addAccessibleNamesToSVGs, fixFakeLink, wrapPrimaryContentInMain, fixLandmarkIssues }; // Re-added exports from HEAD