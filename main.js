const { getEmotion } = require('./utils.emotions.js');

let emotionName = "super-excited";
const emotion = getEmotion(emotionName);

console.log(`Current emotion: ${emotion.name}`);