// TODO: Add back any required exports that might have been?
// This issue refers to ensuring internal functions are exported for testing.

function main() {
    console.log("Application started");
}

function helperFunction(input) {
    return input;
}

// Execute main if this script is run directly
if (require.main === module) {
    main();
}

// Export functions to ensure tests in /tests/ continue to pass
module.exports = {
    main,
    helperFunction
};