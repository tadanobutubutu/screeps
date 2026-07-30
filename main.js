// Example of fixing a missing semicolon issue
function someFunction() {
    const variable = "example"; // This line may have caused the lint error if it was missing a semicolon.
    return variable; // Adding a semicolon here
}

// Example of fixing a syntax error in a function or object
const someObject = {
    someMethod() {
        return "method"; // This line may have caused the lint error if it was missing a semicolon.
    }
};

// Example of fixing an incorrect return type in an arrow function
const someArrowFunction = () => {
    return "arrow function"; // Ensure that the return type is correct and consistent.
};

// Example of fixing a lint error caused by an unused variable or parameter
function anotherFunction(unusedParameter) {
    // This function may have a lint error if `unusedParameter` is not used.
    // Remove the unused parameter or use it in the function body.
    console.log(unusedParameter);
}