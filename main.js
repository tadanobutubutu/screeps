const { visualizeMemory } = require('./memory.visualizer.js');
const { initializeMemory } = require('./memory.manager.js');

function main() {
    const memory = initializeMemory();
    const visualization = visualizeMemory(memory);
    console.log(visualization);
}

module.exports = { main };

if (require.main === module) {
    main();
}