// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Additional functionality can be added here if needed
// while preserving the existing code structure

function calculateDiscount(price, discountRate) {
    // Calculate and return the discounted price
    return price - (price * discountRate);
}

module.exports = {
    // Preserve all existing exports
    // ...
    calculateDiscount: calculateDiscount
};