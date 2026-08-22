// Main entry point for Screeps application
import * as Screeps from './Screeps';
import { render } from './render';

// Initialize the application
const app = new ScreepsApp();

// Set up the main rendering loop
app.on('update', () => {
  // Update the UI with current game state
  render();
});

export default app;