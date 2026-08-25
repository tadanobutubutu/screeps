const graphMetrics = require('./graphMetrics');

const { dependencyGraphContent, indexContent } = require('./content');

const { renderContent, renderGraph, renderLandmarks } = require('some-rendering-module');

const BUTTON_ID = 'resolve-conflict-button';

function calculateGraphMetrics(dependencies) {
  const metrics = graphMetrics.getGraphMetrics(dependencies);
  return JSON.stringify(metrics);
}

function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

function fixTableStructureIssues(document) {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const headerCells = firstRow.querySelectorAll('th, td');
        const headerRow = document.createElement('tr');
        headerCells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr')).filter(row => !row.parentElement.isSameNode(table.querySelector('thead')));
      const tbody = document.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
  });
}

function addMainLandmark(document) {
  const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!mainElement) {
    const newMain = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(newMain, body.firstChild);
    } else {
      body.appendChild(newMain);
    }
  }
}

function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  let svgCount = 0;
  svgs.forEach((svg, index) => {
    if (svgCount < 2) {
      const id = `svg-title-${index}`;
      const title = document.createElement('title');
      title.id = id;
      title.textContent = svg.getAttribute('aria-hidden') === 'true' ? 'Decorative graphic' : `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', id);
      svgCount++;
    }
  });
}

function ensureUniqueLandmarks(document) {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(role);
    if (elements.length > 1) {
      let count = 0;
      elements.forEach(el => {
        if (count > 0) {
          el.removeAttribute('role');
          if (el.tagName.toLowerCase() !== role) {
            el.setAttribute('role', role);
          }
        }
        count++;
      });
    }
  });
}

function fixFakeLinkIssue(document) {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'id') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    button.textContent = link.textContent;
    link.parentNode.replaceChild(button, link);
  });
}

const addProperLandmarkRegions = function(content) {
  if (content && typeof content === 'string') {
    let result = content;

    if (!/<header/gi.test(result)) {
      const bodyMatch = result.match(/<body[^>]*>/i);
      if (bodyMatch) {
        result = result.replace(bodyMatch[0], bodyMatch[0] + '<header></header>');
      } else {
        result = '<header></header>' + result;
      }
    }

    if (!/<footer/gi.test(result)) {
      result = result.replace(/<\/body>/i, '<footer></footer></body>');
    }

    return result;
  }
  return content;
};

const renderDependencyGraph = function(layout) {
  if (layout === 'horizontal') {
    return dependencyGraphContent.horizontal || '<div class="dependency-graph horizontal"></div>';
  } else if (layout === 'vertical') {
    return dependencyGraphContent.vertical || '<div class="dependency-graph vertical"></div>';
  }
  return dependencyGraphContent.default;
};

const addMissingLandmarks = function(content) {
  if (content && typeof content === 'string') {
    let result = content;

    if (!/<header/gi.test(result)) {
      const bodyMatch = result.match(/<body[^>]*>/i);
      if (bodyMatch) {
        result = result.replace(bodyMatch[0], bodyMatch[0] + '<header></header>');
      }
    }

    if (!/<footer/gi.test(result)) {
      result = result.replace(/<\/body>/i, '<footer></footer></body>');
    }

    return result;
  }
  return content;
};

const renderPage = function(content) {
  let result = content;

  const dependencyGraph = renderGraph(content, addProperLandmarkRegions, addMissingLandmarks);
  result = result.replace(/<!-- TODO: Add rendering of dependency graph here -->/, dependencyGraph);

  const landmarks = renderLandmarks(content);
  if (landmarks) {
    const landmarksResult = Array.isArray(landmarks) ? landmarks.join('') : landmarks;
    result = result.replace(/<!-- TODO: Add rendering of landmarks here -->/, landmarksResult);
  }

  result = renderContent ? renderContent(result) : result;
  return result;
};

function handleConflict() {
  console.log('Handling conflict resolution...');
}

function handleConflictMarkers() {
  const buttonElement = document.getElementById(BUTTON_ID);
  if (buttonElement) {
    buttonElement.setAttribute('aria-label', 'Handle conflict resolution');
  }
}

function handleConflictResolution(document) {
  addLangAttribute(document);
  fixTableStructureIssues(document);
  addMainLandmark(document);
  addSvgAccessibleNames(document);
  ensureUniqueLandmarks(document);
  fixFakeLinkIssue(document);

  const buttonElement = document.getElementById(BUTTON_ID);
  if (buttonElement) {
    buttonElement.textContent = 'Handle conflict resolution';
  }
}

function handleConflictWithAccessibility(document) {
  handleConflict();
  handleConflictResolution(document);
}

module.exports = {
  calculateGraphMetrics,
  handleConflict,
  handleConflictMarkers,
  handleConflictResolution,
  handleConflictWithAccessibility,
  BUTTON_ID,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addProperLandmarkRegions,
  renderDependencyGraph,
  addMissingLandmarks,
  renderPage
};