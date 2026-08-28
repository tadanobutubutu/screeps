const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

function calculateDiscount(price, discountRate) {
    // Calculate and return the discounted price
    return price - (price * discountRate);
}

module.exports = {
    // Preserve all existing exports
    // ...
    calculateDiscount: calculateDiscount
};