const fs = require('fs');
const path = require('path');

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

function calculateDiscount(price, discountRate) {
    // Calculate and return the discounted price
    return price - (price * discountRate);
}

// TODO: Add back any required exports that might have been removed
// Assuming that there are no exports removed, this section should be kept as is.
module.exports = {
    // Preserve all existing exports
    // ...
    calculateDiscount: calculateDiscount
};