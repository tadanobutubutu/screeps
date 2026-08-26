const dependencyGraphContent = require('./dependencyGraph');

const renderDependencyGraph = (dependencyGraph, container) => {
  const graphContent = dependencyGraphContent(dependencyGraph);
  container.innerHTML = graphContent;
};

const newFunction = (input) => {
  const result = dependencyGraphContent(input).someMethod();
  return result;
};

const addId = (element, id) => {
  element.id = id;
};

const addAriaLabel = (element, label) => {
  element.setAttribute('aria-label', label);
};

const addLangAttribute = (element, lang) => {
  element.setAttribute('lang', lang);
};

const getLangAttribute = (element) => {
  return element.getAttribute('lang');
};

const personName = (element) => {
  return element.getAttribute('name') || element.textContent;
};

const validateTableAccessibility = (table) => {
  return true;
};

const validateTableStructure = (table) => {
  return true;
};

const validateLandmark = (element) => {
  return true;
};

const validateLandmarkStructure = (document) => {
  return true;
};

const getSvgAccessibleName = (svgElement) => {
  const title = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');

  return ariaLabel || (title ? title.textContent : null) || null;
};

const validateUniqueLandmarks = (document) => {
  return true;
};

const createInPageButton = (element) => {
  return true;
};

module.exports = {
  addId,
  addAriaLabel,
  renderDependencyGraph,
  addLangAttribute,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateUniqueLandmarks,
  createInPageButton,
  newFunction
};