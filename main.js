// TODO: Identify and update specific functions that render dependency graphs or
// Functions to ensure the element has an id, add aria-label, render dependency graphs

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const accessiblyHelper = require('./accessiblyHelper');

// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: e1060a659ba0acd8f70570301019d02d1d671c81_

// Helper function to ensure an element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Helper function to add aria-label to element
function addAriaLabel(element, label) {
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

// Function to render dependency graphs
function renderDependencyGraph(dependencies) {
  const graphNodes = [];
  const graphEdges = [];

  if (!dependencies || !Array.isArray(dependencies)) {
    return { nodes: graphNodes, edges: graphEdges };
  }

  dependencies.forEach((dep, index) => {
    const nodeId = `dep-${index}`;
    graphNodes.push({
      id: nodeId,
      label: dep.name || dep,
      type: dep.type || 'default'
    });

    if (dep.dependencies && Array.isArray(dep.dependencies)) {
      dep.dependencies.forEach(subDep => {
        const subNodeId = `dep-${index}-${subDep}`;
        graphNodes.push({
          id: subNodeId,
          label: subDep,
          type: 'dependency'
        });
        graphEdges.push({
          from: nodeId,
          to: subNodeId
        });
      });
    }
  });

  return { nodes: graphNodes, edges: graphEdges };
}

// Generate dependency graph visualization data
function getDependencyGraphData(moduleName) {
  const graphData = {
    module: moduleName,
    dependencies: [],
    visualization: null
  };

  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      Object.keys(deps).forEach(depName => {
        graphData.dependencies.push({
          name: depName,
          version: deps[depName],
          type: 'npm'
        });
      });
    }
  } catch (error) {
    console.error('Error reading dependencies:', error);
  }

  graphData.visualization = renderDependencyGraph(graphData.dependencies);
  return graphData;
}

// Accessibility helper integration for dependency graphs
function enhanceDependencyGraphAccessibility(graphData) {
  if (!graphData || !graphData.visualization) {
    return graphData;
  }

  graphData.visualization.nodes = graphData.visualization.nodes.map(node => {
    const element = { id: node.id };
    ensureElementHasId(element);
    addAriaLabel(element, `Dependency: ${node.label}`);
    return {
      ...node,
      id: element.id,
      ariaLabel: element.getAttribute('aria-label')
    };
  });

  return graphData;
}

function getUserSafetyAdvice(userId) {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  const randomIndex = Math.floor(Math.random() * safetyCategories.length);
  return safetyCategories[randomIndex];
}

const app = express();

app.get('/dependency-graph', (req, res) => {
  const moduleName = req.query.module || 'main';
  let graphData = getDependencyGraphData(moduleName);
  graphData = enhanceDependencyGraphAccessibility(graphData);
  res.json(graphData);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = {
  app,
  UserSafety: 'unsafe',
  getUserSafetyAdvice,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  getDependencyGraphData,
  enhanceDependencyGraphAccessibility
};