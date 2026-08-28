// Import necessary libraries or modules if needed

// Declare the existing exports and functions if needed
let existingExport1, existingFunction1; //... for all current exports and functions in main.js

// Implement the getLangAttribute() and getFullLangAttribute() functions here
function getLangAttribute(element) {
    return element.getAttribute('lang');
}

function getFullLangAttribute(element) {
    // Check if the element has the 'full-lang' attribute
    const fullLang = element.getAttribute('full-lang');
    if (fullLang) {
        return fullLang;
    }

    // If not, return the default lang attribute
    return getLangAttribute(element);
}

// Make sure the new functions work with existing exports and functions
// For example:
// existingFunction1(parameter1, parameter2); //... using the new functions

module.exports = {
    existingExport1,
    existingFunction1,
    // Add the new functions as exports if necessary
    getLangAttribute,
    getFullLangAttribute,
    // ... for all other existing exports in main.js
};