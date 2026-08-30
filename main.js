// Import dependency graph content and index content modules
import { dependencyGraphContent } from './dependencyGraphContent.js';
import { indexContent } from './indexContent.js';
import { renderDependencyGraph } from './dependencyGraphUtils.js';
import { renderIndexView } from './indexUtils.js';
import { getTemplate } from './templates.js';

// Function to render the index view
// Updated: uses indexContent from indexContent module
export function renderIndex(container) {
    const content = indexContent.getIndexContent();
    const template = getTemplate('index');
    
    if (template) {
        const html = template(content);
        container.innerHTML = html;
        return true;
    }
    
    return false;
}

// Function to render the dependency graph
// Updated: uses dependencyGraphContent from dependencyGraphContent module
export function renderDependencyGraphView(container, dependencies) {
    const content = dependencyGraphContent.getDependencyGraphContent(dependencies);
    const template = getTemplate('dependencyGraph');
    
    if (template) {
        const html = template(content);
        container.innerHTML = html;
        return true;
    }
    
    return false;
}

// Initialize the application
export function initializeApp() {
    console.log('Initializing application with updated content modules');
    return true;
}

// Export for testing and external use
export const appVersion = '1.0.0';