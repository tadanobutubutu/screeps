function calculateDiscount(price, discountRate) {
    // Calculate and return the discounted price
    return price - (price * discountRate);
}

module.exports = {
    // Preserve all existing exports
    // ...
    calculateDiscount: calculateDiscount
};