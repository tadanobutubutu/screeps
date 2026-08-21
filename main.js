const React = require('react');
const ReactDOM = require('react-dom');

// Function to address "REACT_015" rule violation
function addLanguageAttribute(component) {
  // Add required language attribute to React components
  if (component && component.props && !component.props.lang) {
    component.props.lang = 'en'; // default value or handle it based on your requirements
  }

  return component;
}

// Function to address "REACT_027" rule violation (table-like structure)
function fixTableStructure(component) {
  // Check and correct table-like structure
  if (component && component.type && component.type.name === 'Table') {
    const children = component.props.children;
    if (children) {
      const theadComponent = children.find(c => c.type && c.type.name === 'Thead');
      if (!theadComponent) {
        const headerRows = children.filter(c => c.type && c.type.name === 'Tr');
        component.props.children = [
          React.createElement('Thead', null, ...headerRows.map(tr => React.cloneElement(tr, {}))),
          ...children
        ];
      }
    }
  }

  return component;
}

// Export the utility functions for use in other modules
module.exports = {
  addLanguageAttribute,
  fixTableStructure
};