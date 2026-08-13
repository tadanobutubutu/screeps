// In utils.emotions.js around line 389
// The error indicates there's an unterminated string constant
// Common causes are:
// 1. Missing closing quote
// 2. Escaped quotes within the string that aren't properly closed

// Example fix pattern:
const exampleString = "This is a properly terminated string"; // Correct
// const badString = "This string is missing a closing quote; // Error

// Please check line 389 and ensure:
// 1. All string literals have matching opening and closing quotes
// 2. Any escaped quotes within the string are properly closed
// 3. There are no unescaped quotes within the string that would terminate it prematurely

// If you can share the actual content around line 389, I can provide a more specific fix