// Existing code from main.js
function getUserSafety() {
    // ... Code for getUserSafety
}

function getSafetyCategories() {
    // ... Code for getSafetyCategories
}

// Export statements
module.exports = {
    getUserSafety,
    getSafetyCategories
};

// TODO: Implement calculateDiscount
function calculateDiscount(price, discountPercentage) {
    return price * (1 - discountPercentage / 100);
}

// Export the new function
module.exports.calculateDiscount = calculateDiscount;