// main.js

const helpers = require('./helpers');

// Existing function
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// Existing exported function
function processOrder(order) {
    const total = calculateTotal(order.items);
    return { ...order, total };
}

// TODO: Add necessary exports for new functions

// New functions
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function validateOrder(order) {
    return order.items && order.items.length > 0;
}

function generateReceipt(order) {
    return {
        orderId: order.id,
        items: order.items,
        total: formatCurrency(order.total)
    };
}

module.exports = {
    processOrder,
    calculateTotal,
    formatCurrency,
    validateOrder,
    generateReceipt
};