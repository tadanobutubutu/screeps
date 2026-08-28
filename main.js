// main.js
// This file is the entry point for the application

const landmarks = [];

// Existing landmark tracking
function addLandmark(name, coordinates) {
    const landmark = {
        id: Date.now(),
        name: name,
        coordinates: coordinates
    };
    landmarks.push(landmark);
    return landmark;
}

// TODO: Implement functions to ensure unique landmarks here
function ensureUniqueLandmarks() {
    const seen = new Set();
    return landmarks.filter(landmark => {
        const key = `${landmark.name}-${landmark.coordinates}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function isLandmarkUnique(name, coordinates) {
    return !landmarks.some(
        landmark => 
            landmark.name === name && 
            landmark.coordinates === coordinates
    );
}

function removeDuplicateLandmarks() {
    const uniqueLandmarks = ensureUniqueLandmarks();
    landmarks.length = 0;
    landmarks.push(...uniqueLandmarks);
    return landmarks;
}

function getUniqueLandmarkByName(name) {
    const matches = landmarks.filter(l => l.name === name);
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    return matches[0];
}

const express = require('express');
const path = require('path');

// Initialize express app
const app = express();

/**
 * Renders the dependency graph view
 * @param {Object} dependencies - The dependencies to display in the graph
 * @param {string} type - The type of graph to render (tree, network, etc.)
 * @returns {string} HTML content for the dependency graph
 */
function renderDependencyGraph(dependencies, type = 'tree') {
    let html = '<div class="dependency-graph" data-type="' + type + '">';
    html += '<h2>Dependency Graph</h2>';
    html += '<div class="graph-container" id="graph">';
    
    if (dependencies && Object.keys(dependencies).length > 0) {
        html += '<svg class="graph-svg">';
        html += '<g class="graph-nodes">';
        
        let x = 100;
        let y = 100;
        
        for (const [name, info] of Object.entries(dependencies)) {
            const deps = info.dependencies || {};
            const depNames = Object.keys(deps);
            
            html += '<g class="node" data-name="' + name + '" data-x="' + x + '" data-y="' + y + '">';
            html += '<rect class="node-bg" x="' + (x - 50) + '" y="' + (y - 15) + '" width="100" height="30" rx="5" />';
            html += '<text class="node-label" x="' + x + '" y="' + y + '">' + name + '</text>';
            
            if (depNames.length > 0) {
                for (let i = 0; i < depNames.length; i++) {
                    const depName = depNames[i];
                    const depY = y + 60 + (i * 50);
                    html += '<line class="edge" x1="' + x + '" y1="' + (y + 15) + '" x2="' + x + '" y2="' + (depY - 15) + '" />';
                    html += '<g class="node" data-name="' + depName + '" data-x="' + x + '" data-y="' + depY + '">';
                    html += '<rect class="node-bg" x="' + (x - 50) + '" y="' + (depY - 15) + '" width="100" height="30" rx="5" />';
                    html += '<text class="node-label" x="' + x + '" y="' + depY + '">' + depName + '</text>';
                    html += '</g>';
                }
            }
            
            html += '</g>';
            x += 150;
        }
        
        html += '</g>';
        html += '</svg>';
    } else {
        html += '<p class="no-dependencies">No dependencies to display</p>';
    }
    
    html += '</div>';
    html += '<div class="graph-legend">';
    html += '<span class="legend-item"><span class="legend-color"></span> Dependencies</span>';
    html += '</div>';
    html += '</div>';
    
    return html;
}

/**
 * Renders the index view with available navigation options
 * @param {Object} options - Configuration options for the index view
 * @param {Array} options.recentProjects - List of recent projects
 * @param {Object} options.stats - Statistics to display
 * @returns {string} HTML content for the index view
 */
function renderIndexView(options = {}) {
    const recentProjects = options.recentProjects || [];
    const stats = options.stats || { totalProjects: 0, totalDependencies: 0 };
    
    let html = '<!DOCTYPE html>';
    html += '<html lang="en">';
    html += '<head>';
    html += '<meta charset="UTF-8">';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    html += '<title>Dependency Dashboard</title>';
    html += '<style>';
    html += 'body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }';
    html += '.container { max-width: 1200px; margin: 0 auto; }';
    html += '.header { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }';
    html += '.stats { display: flex; gap: 20px; margin-top: 10px; }';
    html += '.stat-card { background: #e3f2fd; padding: 15px; border-radius: 5px; flex: 1; }';
    html += '.stat-value { font-size: 24px; font-weight: bold; color: #1976d2; }';
    html += '.stat-label { color: #666; font-size: 14px; }';
    html += '.projects { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }';
    html += '.project-item { padding: 10px; border-bottom: 1px solid #eee; }';
    html += '.project-item:last-child { border-bottom: none; }';
    html += '</style>';
    html += '</head>';
    html += '<body>';
    html += '<div class="container">';
    html += '<div class="header">';
    html += '<h1>Dependency Dashboard</h1>';
    html += '<div class="stats">';
    html += '<div class="stat-card">';
    html += '<div class="stat-value">' + stats.totalProjects + '</div>';
    html += '<div class="stat-label">Total Projects</div>';
    html += '</div>';
    html += '<div class="stat-card">';
    html += '<div class="stat-value">' + stats.totalDependencies + '</div>';
    html += '<div class="stat-label">Total Dependencies</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="projects">';
    html += '<h2>Recent Projects</h2>';
    
    if (recentProjects.length > 0) {
        for (const project of recentProjects) {
            html += '<div class="project-item">';
            html += '<strong>' + project.name + '</strong>';
            html += '<span> - ' + project.dependencyCount + ' dependencies</span>';
            html += '</div>';
        }
    } else {
        html += '<p>No recent projects found.</p>';
    }
    
    html += '</div>';
    html += '</div>';
    html += '</body>';
    html += '</html>';
    
    return html;
}

/**
 * Updates the dependency graph with new data
 * @param {string} containerId - The ID of the container element
 * @param {Object} data - The new dependency data
 */
function updateDependencyGraph(containerId, data) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = renderDependencyGraph(data.dependencies, data.type || 'tree');
        container.setAttribute('data-updated', new Date().toISOString());
    }
}

/**
 * Updates the index view with new options
 * @param {string} containerId - The ID of the container element
 * @param {Object} options - The new options data
 */
function updateIndexView(containerId, options) {
    const container = document.getElementById(containerId);
    if (container) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderIndexView(options);
        container.innerHTML = tempDiv.innerHTML;
    }
}

// Sample data for the application
const appData = {
    title: 'Landmark Checker',
    version: '1.0.0'
};

function helloWorld() {
  return 'Hello, World!';
}

// Function to initialize the dependency graph with accessibility support
function initDependencyGraph(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.setAttribute('role', 'img');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return container;
}

// Helper function to get element by ID
function getElementById(id) {
    return document.getElementById(id);
}

// Helper function to query elements
function queryElements(selector) {
    return document.querySelectorAll(selector);
}

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
    const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'article', 'section'];
    const results = {};
    
    landmarks.forEach(landmark => {
        const elements = document.querySelectorAll(landmark);
        results[landmark] = {
            count: elements.length,
            exists: elements.length > 0
        };
    });
    
    return results;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    const results = checkLandmarkElements();
    const validation = {
        isValid: true,
        errors: [],
        warnings: []
    };
    
    if (!results.main.exists) {
        validation.isValid = false;
        validation.errors.push('Missing required <main> landmark element');
    }
    
    if (!results.header.exists) {
        validation.warnings.push('No <header> landmark element found');
    }
    
    if (!results.nav.exists) {
        validation.warnings.push('No <nav> landmark element found');
    }
    
    if (!results.footer.exists) {
        validation.warnings.push('No <footer> landmark element found');
    }
    
    return validation;
}

// Initialize application
function init() {
    console.log('Initializing ' + appData.title + ' v' + appData.version);
    return checkLandmarkElements();
}

// Export functions for use in routes
module.exports = {
    app,
    landmarks,
    addLandmark,
    ensureUniqueLandmarks,
    isLandmarkUnique,
    removeDuplicateLandmarks,
    getUniqueLandmarkByName,
    renderDependencyGraph,
    renderIndexView,
    updateDependencyGraph,
    updateIndexView,
    helloWorld,
    initDependencyGraph,
    getElementById,
    queryElements,
    checkLandmarkElements,
    validateLandmarkStructure,
    init,
    appData
};

// Start server if run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    
    app.get('/', (req, res) => {
        const indexOptions = {
            recentProjects: [
                { name: 'project-a', dependencyCount: 12 },
                { name: 'project-b', dependencyCount: 8 }
            ],
            stats: {
                totalProjects: 2,
                totalDependencies: 20
            }
        };
        res.send(renderIndexView(indexOptions));
    });
    
    app.get('/dependency-graph', (req, res) => {
        const dependencies = {
            'express': { version: '4.18.2', dependencies: { 'debug': { version: '2.6.9' } } },
            'lodash': { version: '4.17.21', dependencies: {} }
        };
        res.send(renderDependencyGraph(dependencies, 'tree'));
    });
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}