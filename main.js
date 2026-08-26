// main.js

// Import required modules
const { renderCreep } = require('./renderCreep');
const { renderStructure } = require('./renderStructure');
const { renderController } = require('./renderController');

// TODO: Add these imported modules to the relevant rendering functions

/**
 * Main rendering function that orchestrates all rendering operations
 */
function renderAll() {
    renderCreep();
    renderStructure();
    renderController();
}

module.exports = {
    renderAll,
    renderCreep,
    renderStructure,
    renderController
};