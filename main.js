// Main entry point for Screeps bot
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');

// REACT_017: React Landmarks - Helper Functions
// Checks if HTML content has a <main> landmark for accessibility

/**
 * Checks if the given HTML content contains a <main> landmark
 * @param {string} htmlContent - The HTML content to check
 * @returns {boolean} - True if <main> landmark is present
 */
function hasMainLandmark(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return false;
  }
  // Match <main> tag with optional attributes
  const mainTagRegex = /<main(?:\s[^>]*)?\s*>/i;
  return mainTagRegex.test(htmlContent);
}

/**
 * Validates a list of HTML files for the <main> landmark requirement (REACT_017)
 * @param {Array<{path: string, content: string}>} files - Array of file objects with path and content
 * @returns {Object} - Object with passed and failed file arrays
 */
function checkMainLandmarks(files) {
  const results = {
    passed: [],
    failed: [],
    warnings: 2 // Number of occurrences from issue
  };

  if (!Array.isArray(files)) {
    return results;
  }

  files.forEach(file => {
    if (file && file.path && hasMainLandmark(file.content)) {
      results.passed.push(file.path);
    } else if (file && file.path) {
      results.failed.push(file.path);
    }
  });

  return results;
}

/**
 * Adds a <main> landmark wrapper around content if missing
 * @param {string} htmlContent - The HTML content to modify
 * @param {string} contentToWrap - The content to wrap in <main> tags
 * @returns {string} - Modified HTML content with <main> landmark
 */
function addMainLandmark(htmlContent, contentToWrap) {
  if (!htmlContent || !contentToWrap) {
    return htmlContent;
  }

  if (hasMainLandmark(htmlContent)) {
    return htmlContent; // Already has main landmark
  }

  // Insert main landmark after <body> or before closing </body>
  const bodyMatch = htmlContent.match(/<body(?:\s[^>]*)?>/i);
  if (bodyMatch) {
    const bodyTag = bodyMatch[0];
    const bodyIndex = htmlContent.indexOf(bodyTag) + bodyTag.length;
    return (
      htmlContent.slice(0, bodyIndex) +
      '\n    <main>' +
      contentToWrap +
      '</main>\n' +
      htmlContent.slice(bodyIndex)
    );
  }

  // [PERSON_NAME]: insert at the beginning if no body tag found
  return '<main>\n' + contentToWrap + '\n</main>\n' + htmlContent;
}

module.exports = {
  loop: function() {
    // Clear memory of dead creeps
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Count existing roles
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');

    // Spawn harvesters if needed
    if (harvesters.length < 2) {
      const newName = '[PERSON_NAME]' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: 'harvester' }
      });
    }

    // Spawn upgraders if needed
    if (upgraders.length < 2) {
      const newName = 'Upgrader' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: 'upgrader' }
      });
    }

    // Spawn builders if needed
    if (builders.length < 1) {
      const newName = 'Builder' + Game.time;
      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: 'builder' }
      });
    }

    // Run role logic for each creep
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      if (creep.memory.role === 'harvester') {
        roleHarvester.run(creep);
      } else if (creep.memory.role === 'upgrader') {
        roleUpgrader.run(creep);
      } else if (creep.memory.role === 'builder') {
        roleBuilder.run(creep);
      }
    }
  },
  hasMainLandmark,
  checkMainLandmarks,
  addMainLandmark
};