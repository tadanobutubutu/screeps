// memory.visualizer.js
// Maintain all existing imports and exports
// Add any new functionality below while preserving existing code

// Example of how to fix a common issue (if this matches your case):
// Before (problematic line 31):
// const someObject = { method: () => { ... } };
// someObject.method().someProperty // This could cause the error

// After (fixed version):
// const someObject = { method: () => { ... } };
// const result = someObject.method();
// const someProperty = result.someProperty; // Split into separate statements

// [Your existing code here]
// Make sure to preserve all exports at the bottom of the file