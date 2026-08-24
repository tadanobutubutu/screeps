// Original code that might be in conflict
// dependencyGraphContent.someMethod();

// Updated code
// dependencyGraphContent.indexContent.someMethod();

// Or if it's being used as a property
// const value = dependencyGraphContent.someProperty;

// Updated code
const value = dependencyGraphContent.indexContent.someProperty;