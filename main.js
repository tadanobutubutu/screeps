// main.js - Screeps game logic entry point

// The main game loop that runs every tick
function loop() {
    // Game logic goes here
}

// Another example function added for the asked question
function exampleFunc() {
    // Example logic for the additional function
}

// Configuration settings for the game
const config = {
    // Add your configuration options here
    maxCreeps: 50,
    room: 'W0N0',
    // The default language for the game/document
    lang: 'en',
};

// New function to set the language attribute on a document (useful for React/SSR environments)
function setLanguage(doc) {
    if (doc && doc.documentElement) {
        doc.documentElement.lang = config.lang;
    }
}

// Export the loop function for the game engine as requested
module.exports = {
    loop: loop,
    exampleFunc: exampleFunc,
    config: config,
    setLanguage: setLanguage,
    // Add any missing exports here if necessary
};