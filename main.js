const fs = require('fs');
const path = require('path');

// Main game loop for Screeps
module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Your game logic here
  },

  // TODO: Implement a function to count dependencies
  countDependencies: function() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  // ... existing code below ...

  main: function() {
    return 'Hello World';
  },

  SomeClass: SomeClass,

  someUtility: function() {
    return true;
  },

  config: {
    enabled: true
  }
};

function SomeClass() {}

function main() {
  return 'Hello World';
}

function someUtility() {
  return true;
}

function countDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

module.exports.loop = module.exports.loop;
module.exports.countDependencies = countDependencies;
module.exports.main = main;
module.exports.SomeClass = SomeClass;
module.exports.someUtility = someUtility;
module.exports.config = { enabled: true };