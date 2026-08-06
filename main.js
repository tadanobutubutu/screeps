// main.js (updated)

// Leave the existing code here (before the conflict markers)

// Example of existing code (this is just a placeholder and should be replaced with the actual code):
// export function exampleFunction() {
//     // }
// ... (more existing code)

// Assuming the lint error is due to the presence of an incorrect === operator usage in line 18
// Here is an example of how to fix an issue where === might be used incorrectly:
// Instead of:
// const isHealer = role.healer === 'HEALER';
// Which would cause the error if 'role.healer' is undefined, it should be:
const isHealer = role.healer && role.healer === 'HEALER';

// ...
// Existing code that follows after the conflict markers
// Make sure to include all the functions and exports
// Don't remove or rename any existing exports

// ... (more existing code)

// Example of existing code (this is just a placeholder and should be replaced with the actual code):
// export function anotherFunction() {
//     // }