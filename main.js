// In utils.emotions.js around line 389
// The error occurs when a string isn't properly closed with matching quotes
// Common causes are:
// 1. Missing closing quote
// 2. Using different quote types (single vs double)
// 3. Escaped quotes that aren't properly handled

// Example of a fix:
const exampleString = "This is a properly terminated string"; // Correct
// const badString = "This string is missing a closing quote; // Incorrect

// If you share the actual code around line 389, I can provide a more specific fix