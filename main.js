import React from 'react';
import { useTable } from 'react-table';
import dependencyGraphContent from './dependencyGraphContent';
import indexContent from './indexContent';

// Add ARIA attributes to improve accessibility
export function addAriaAttributes() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    if (!mainElement.getAttribute('role')) {
      mainElement.setAttribute('role', 'main');
    }
    if (!mainElement.id) {
      mainElement.id = 'main-content';
      mainElement.setAttribute('aria-label', 'Main content');
    }
  }
}

// Existing code and exports
addAriaAttributes();
const restoredModule = require('./utils');
export function existingFunction1() { /* ... */ }
export const existingConst1 = 'existing value';
export function newFunction1() { /* ... */ }
export const newConst1 = 'new value';
// FIX: Add back the stripped module export
export default restoredModule;
export function reactLanguageAttributeFix(reactElement) {
  if (reactElement && reactElement.props) {
    const langAttr = reactElement.props.lang;
    if (langAttr) {
      console.warn(`Language attribute detected on non-accessible element: ${langAttr}`);
      return React.cloneElement(reactElement, { lang: 'en' });
    }
  }
  return reactElement;
}
const EnhancedTable = ({ children }) => {
  return React.cloneElement(children, { role: 'table' });
};
export { EnhancedTable };
export function removeDuplicateMainElements(children) {
  const mainElements = children.filter((child) => child && child.type === 'main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements detected. Only one <main> element is allowed.');
    return React.cloneElement(mainElements[0], { children: mainElements.slice(1) });
  }
  return children;
}
export function addLangAttributeToRoot() {
  const rootElement = document.documentElement;
  if (rootElement && !rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
}
export function addressAccessibilityIssues(elements) {
  const validElements = [];
  elements.forEach((element) => {
    if (element && element.props && element.props.children) {
      validElements.push(element);
    }
  });
  return validElements;
}
const mainContent = React.createElement('main', { id: 'mainContent' });
(() => {
  setTimeout(() => {
    const mainChildren = [mainContent].filter((element) => element && element.type === 'div');
    const mainContentElements = mainChildren;
    if (mainContentElements.length > 0) {
      console.log('Accessibility issues addressed');
    }
    fixAccessibilityIssues();
    fixDuplicateMainIssue();
    fixFakeLinkIssue();
    renderDependencyGraphVisualization(); // New call to updated function
  }, 0);
})();
export function getLangAttribute(element) {
  if (element && element.props && element.props.lang) {
    return element.props.lang;
  }
  return null;
}
export function getFullLangAttribute(element) {
  const lang = getLangAttribute(element);
  if (lang) {
    return lang;
  }
  return 'en';
}
export function validateTableAccessibility(tableElement) {
  if (!tableElement || !tableElement.props) {
    return false;
  }
  const hasAriaLabel = tableElement.props['aria-label'] || tableElement.props['ariaLabel'];
  const hasAriaLabelledBy = tableElement.props['aria-labelledby'] || tableElement.props['ariaLabelledBy'];
  return !!(hasAriaLabel || hasAriaLabelledBy);
}
export function validateTableStructure(tableElement) {
  if (!tableElement || !tableElement.props) {
    return false;
  }
  const children = tableElement.props.children ? Array.isArray(tableElement.props.children) ? tableElement.props.children : [tableElement.props.children] : [];
  const hasThead = children.some(child => child && (child.type === 'thead' || (child.type === 'thead' && child)));
  const hasTbody = children.some(child => child && (child.type === 'tbody' || (child.type === 'tbody' && child)));
  return !!(hasThead && hasTbody);
}
export function validateLandmark(element) {
  const landmarkRoles = ['header', 'nav', 'main', 'footer', 'article', 'aside', 'section', 'complementary', 'banner', 'contentinfo', 'navigation', 'search'];
  if (!element || !element.props) {
    return false;
  }
  const role = element.props.role;
  return landmarkRoles.includes(role);
}
export function validateUniqueLandmarks(elements) {
  if (!elements || !Array.isArray(elements)) {
    return false;
  }
  let mainCount = 0;
  let navCount = 0;
  elements.forEach(element => {
    if (element && element.props) {
      const role = element.props.role;
      if (role === 'main') mainCount++;
      if (role === 'navigation' || role === 'nav') navCount++;
    }
  });
  return mainCount <= 1;
}
export function getSvgAccessibleName(svgElement) {
  if (!svgElement || !svgElement.props) {
    return null;
  }
  if (svgElement.props['aria-label']) {
    return svgElement.props['aria-label'];
  }
  if (svgElement.props['aria-labelledby']) {
    return svgElement.props['aria-labelledby'];
  }
  const children = svgElement.props.children ? Array.isArray(svgElement.props.children) ? svgElement.props.children : [svgElement.props.children] : [];
  const titleElement = children.find(child => child && child.type === 'title');
  if (titleElement && titleElement.props) {
    return titleElement.props.children;
  }
  return null;
}
export function createAccessibleButton(linkText, onClick) {
  return React.createElement('button', { type: 'button', onClick: onClick, 'aria-label': linkText }, linkText);
}
export function createAccessibleLink(href, linkText, isExternal = false) {
  const props = { href: href, 'aria-label': linkText };
  if (isExternal) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  return React.createElement('a', props, linkText);
}
export function renderDependencyGraphVisualization() {
  const graphContainer = document.getElementById('dependency-graph');
  if (graphContainer) {
    graphContainer.innerHTML = '';
    const graphElement = dependencyGraphContent();
    graphContainer.appendChild(graphElement);
  }
}
export function renderIndexVisualization() {
  const indexContainer = document.getElementById('index-view');
  if (indexContainer) {
    indexContainer.innerHTML = '';
    const indexElement = indexContent();
    indexContainer.appendChild(indexElement);
  }
}
export function fixAccessibilityIssues() {
  const rootElement = document.documentElement;
  if (rootElement && !rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements detected. Only one <main> element is allowed.');
  }
}
export function ensureUniqueLandmarkIds() {
  const landmarkRoles = ['header','nav','main','footer','article','aside','section'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
    elements.forEach((el, idx) => {
      if (!el.id) {
        el.id = `${role}-${idx + 1}`;
      }
    });
  });
}
export function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a:not([href])');
  links.forEach(link => {
    if (link) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}
export function wrapPrimaryContentInMain() {
  const mainContent = document.getElementById('mainContent');
  if (mainContent) {
    const newMain = document.createElement('main');
    newMain.id = 'primaryContent';
    newMain.appendChild(mainContent);
    return newMain;
  }
  return null;
}
export function assignLandmarkRoles() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'article', 'aside', 'section'];
  const allElements = document.querySelectorAll(landmarks.join(', '));
  allElements.forEach((element) => {
    if (element) {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      if (!element.getAttribute('role') && landmarks.includes(tagName)) {
        element.setAttribute('role', tagName);
      }
    }
  });
}
export function fixDuplicateMainIssue() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements detected. Only one <main> element is allowed.');
  }
}
export function wrapContentInMain() {
  const rootElement = document.documentElement;
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const body = document.body;
    const newMain = document.createElement('main');
    newMain.id = 'main-content';
    newMain.setAttribute('role', 'main');
    rootElement.insertBefore(newMain, body);
  }
}
export function renderContentVisualization() {
  const contentContainer = document.getElementById('primary-content');
  if (contentContainer) {
    contentContainer.innerHTML = '';
    const contentElement = indexContent();
    contentContainer.appendChild(contentElement);
  }
}
export function renderIndexVisualization() {
  const indexContainer = document.getElementById('index-view');
  if (indexContainer) {
    indexContainer.innerHTML = '';
    const indexElement = indexContent();
    indexContainer.innerHTML = indexElement;
  }
}
export function renderContentVisualization() {
  const contentContainer = document.getElementById('primary-content');
  if (contentContainer) {
    contentContainer.innerHTML = '';
    const contentElement = indexContent();
    contentContainer.innerHTML = contentElement;
  }
}
export function renderTableStructuralCompliance() {
  const tableElements = document.querySelectorAll('table');
  tableElements.forEach(table => {
    if (validateTableAccessibility(table) && validateTableStructure(table)) {
      return;
    }
    if (!validateTableStructure(table)) {
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Column Header 1</th><th>Column Header 2</th></tr>';
      if (!table.querySelector('thead')) {
        if (table.tHead) {
          thead.innerHTML = table.tHead.innerHTML;
          table.tHead = null;
        }
        if (!table.querySelector('thead')) {
          table.insertBefore(thead, table.tBodies[0]);
        }
      }
    }
  });
}
function initializeApp() {
  addAriaAttributes();
  addLangAttributeToRoot();
  renderDependencyGraphVisualization();
  renderIndexVisualization();
  renderTableStructuralCompliance();
  renderContentVisualization();
}
initializeApp();