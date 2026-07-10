// main.js
// Fixed "Parsing error: Unexpected token ." by ensuring no statement 
// begins with a dot and that method chaining is correctly attached 
// to its preceding expression.

const MemoryVisualizer = require('./memory.visualizer.js');

const visualizer = new MemoryVisualizer();

// Corrected method invocation (no line starting with a dot)
visualizer
  .init()
  .then(() => {
    console.log('Memory visualizer initialized successfully.');
  })
  .catch((err) => {
    console.error('Failed to initialize memory visualizer:', err);
  });

module.exports = visualizer;