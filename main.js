const tutorialConfig = {
  version: '1.0.0',
  name: 'tutorial',
  auto: true,
  rules: {
    enabled: true,
    strict: false
  }
};

function initializeTutorial() {
  return {
    status: 'initialized',
    config: tutorialConfig,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  tutorialConfig,
  initializeTutorial
};