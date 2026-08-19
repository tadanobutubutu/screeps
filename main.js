// Module constants
const LANG = 'en';
const Html = require('./html');
const Config = require('./config');
const { log } = require('./utils');

// Main entry point
function main() {
  log('Screeps bot starting...');
  
  const config = Config.get();
  log(`Running with config: ${JSON.stringify(config)}`);
  
  // Initialize the HTML output with language attribute
  const html = new Html({
    lang: LANG,
    title: 'Screeps Analysis'
  });
  
  // Your Screeps logic here
  return {
    html,
    config
  };
}

// Export for testing
module.exports = { main, LANG };

// Run if executed directly
if (require.main === module) {
  main();
}