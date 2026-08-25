// Address accessibility issues from insight report

// Import user safety function (Assuming it's a separate file)
// Replace Path with the correct path to your safety function file
// Ensure to export the safety function as default
import Safety from "path/to/safety";

// Import other necessary modules or functions here if needed

// Function to check if an emoji is sequential
function isSequentialEmoji(emoji) {
  // Regular expression pattern for sequential emojis
  const sequentialEmojiPattern = /^(\U0001F600-\U0001F64F)(\U0001F670-\U0001F67F)*(\U0001F680-\U0001F6FF)*$/;

  // Test the emoji against the pattern
  return sequentialEmojiPattern.test(emoji);
}

// Modify any other related functions or variables as needed to adhere to the accessibility standards

// Ensure existing exports are kept intact
// Example:
// module.exports = { someFunction, someOtherFunction };

// Export the new functions you've added
module.exports = { Safety, isSequentialEmoji };