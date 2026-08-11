const tutorialData = require('./tutorial.data');

// utils.tasks.js
// [Preserve all existing code above line 47]

/**
 * This is a properly terminated multi-line comment
 * that was missing its closing tag
 */
function someExistingFunction() {
  // [Preserve all existing function code]
}

// [Preserve all remaining code below line 47]

// In utils.emotions.js, around line 389
// The issue is likely a missing closing quote for a string
// Here's the corrected version:

const emotionString = "This is a properly terminated string";

// Tutorial automation functions
function getNextStep(userId) {
  return tutorialData.getNextStep(userId);
}

function completeStep(userId, stepId) {
  return tutorialData.completeStep(userId, stepId);
}

function getProgress(userId) {
  return tutorialData.getProgress(userId);
}

function resetTutorial(userId) {
  return tutorialData.resetTutorial(userId);
}

// Export the combined API
module.exports = {
  getNextStep,
  completeStep,
  getProgress,
  resetTutorial,
  someExistingFunction,
  emotionString
};