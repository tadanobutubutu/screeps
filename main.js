// tutorial.automated.js

const tutorialData = require('./tutorial.data');

module.exports = {
  // Tutorial automation functions
  getNextStep: function(userId) {
    return tutorialData.getNextStep(userId);
  },
  
  completeStep: function(userId, stepId) {
    return tutorialData.completeStep(userId, stepId);
  },
  
  getProgress: function(userId) {
    return tutorialData.getProgress(userId);
  },
  
  resetTutorial: function(userId) {
    return tutorialData.resetTutorial(userId);
  }
};