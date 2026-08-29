module.exports.loop = function () {
  // Main game loop logic goes here
};

module.exports.runCreep = function (creep) {
  // Creep logic placeholder
};

module.exports.manageRoom = function (room) {
  // Room management logic placeholder
};

module.exports.calculateSum = function(a, b) { return a + b; };

module.exports.ensureUniqueLandmarks = function (landmarks) {
  const seen = new Set();
  for (const landmark of landmarks) {
    if (seen.has(landmark)) {
      throw new Error(`Duplicate landmark detected: ${landmark}`);
    }
    seen.add(landmark);
  }
  return true;
};

module.exports = {
  loop: module.exports.loop,
  runCreep: module.exports.runCreep,
  manageRoom: module.exports.manageRoom,
  calculateSum: module.exports.calculateSum,
  ensureUniqueLandmarks: module.exports.ensureUniqueLandmarks
};