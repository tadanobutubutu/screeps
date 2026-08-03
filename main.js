// memory.visualizer.js

/**
 * Memory Visualizer Module
 * Handles visualization of memory allocation and usage
 */

// Default configuration
const defaultConfig = {
    width: 800,
    height: 600,
    nodeColor: '#3498db',
    edgeColor: '#95a5a6',
    showLabels: true
};

/**
 * Initialize the memory visualizer
 * @param {Object} config - Configuration options
 * @returns {Object} - Visualizer instance
 */
function initializeVisualizer(config = {}) {
    const settings = { ...defaultConfig, ...config };
    
    return {
        settings,
        nodes: [],
        edges: [],
        
        addNode: function(id, label, size = 1) {
            this.nodes.push({ id, label, size });
            return this;
        },
        
        addEdge: function(fromId, toId, weight = 1) {
            this.edges.push({ fromId, toId, weight });
            return this;
        },
        
        render: function() {
            // Render visualization logic
            return {
                nodes: this.nodes,
                edges: this.edges,
                dimensions: {
                    width: settings.width,
                    height: settings.height
                }
            };
        }
    };
}

/**
 * Calculate memory usage statistics
 * @param {Array} nodes - Array of memory nodes
 * @returns {Object} - Statistics object
 */
function calculateStats(nodes) {
    if (!Array.isArray(nodes)) {
        return { error: 'Invalid input: expected array' };
    }
    
    const totalSize = nodes.reduce((sum, node) => sum + (node.size || 0), 0);
    const averageSize = nodes.length > 0 ? totalSize / nodes.length : 0;
    
    return {
        count: nodes.length,
        totalSize,
        averageSize,
        maxSize: Math.max(...nodes.map(n => n.size || 0), 0),
        minSize: Math.min(...nodes.map(n => n.size || 0), 0)
    };
}

// Export functions for use in other modules
module.exports = {
    initializeVisualizer,
    calculateStats
};