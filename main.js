// Main entry point for Screeps game
const Rendering = require('./rendering');
const Scene = require('./scene');

// TODO: Add these imported modules to the relevant rendering functions
// Required imports for rendering functionality:
// - Rendering: handles screen drawing and visual updates
// - Scene: manages game world state and entities

function renderFrame(scene, world) {
  // Apply rendering using the Rendering module
  return Rendering.render(scene, world);
}

function updateWorld(world) {
  // Update world using the Scene module
  return Scene.update(world);
}

module.exports = {
  renderFrame,
  updateWorld,
  Rendering,
  Scene
};