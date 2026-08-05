const emotion = "sad";
const { getEmotionColor } = require('./utils.emotions.js');

module.exports = function() {
  // Main game loop
  return {
    loop: function() {
      console.log('Game tick: ' + Game.time);
      console.log('Current emotion: ' + emotion);
      console.log('Emotion color: ' + getEmotionColor(emotion));
    }
  };
};