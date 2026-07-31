// Main entry point for Screeps

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer between min and max.
 */
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Main game loop function for Screeps.
 * This function is called every tick.
 */
function loop() {
  // Game loop logic goes here
  // This is called by the Screeps engine every tick
}

// Export functions and loop for use by tests and Screeps
module.exports = {
  getRandomInteger: getRandomInteger,
  loop: loop
};