// main.js
// Some utility functions for the application

function greet(name) {
    return `Hello, ${name}!`;
}

function calculateSum(a, b) {
    return a + b;
}

// TODO: Implement ...
function processData(data) {
    // Implementation placeholder
    if (!data) {
        return null;
    }
    
    const processed = data.map(item => {
        return {
            ...item,
            processed: true
        };
    });
    
    return processed;
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = {
    greet,
    calculateSum,
    processData,
    formatDate
};