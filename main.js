// In utils.emotions.js, around line 389
// The issue is likely a missing closing quote for a string
// Here's the corrected version:

// Before (problematic):
// const emotionString = "This is an unterminated string;

// After (fixed):
const emotionString = "This is a properly terminated string";

// Make sure all strings have matching opening and closing quotes
// For multi-line strings, use template literals:
const multiLineString = `This is a multi-line
string that's properly terminated`;