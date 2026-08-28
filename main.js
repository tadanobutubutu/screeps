// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
// Import the required 'tabindex' module from 'react' for focusing on SVG elements
import React from 'react';
import { TabIndex } from 'react';

function helloWorld() {
  return 'Hello, World!';
}

function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');

    // Add tabIndex attribute to improve accessibility and enable focus on the container
    React.useEffect(() => {
      const containerElement = document.getElementById(containerId);
      const tabIndexAttribute = document.createAttribute('tabindex');
      tabIndexAttribute.value = 0; // Set tab index value
      containerElement.setAttributeNode(tabIndexAttribute);
    }, []);
  }
  return container;
}

// Wrap the 'TabIndex' component around the initialized container to provide accessibility possibilities
const WithTabIndex = (WrappedComponent) => {
  return (props) => (
    <TabIndex {...props}>
      <WrappedComponent {...props} />
    </TabIndex>
  );
};

module.exports = {
  helloWorld,
  initDependencyGraph,
  // Wrap initDependencyGraph function using WithTabIndex to improve accessibility
  withTabIndex: WithTabIndex(initDependencyGraph)
};