// Import any necessary dependencies here, if any

const calculateDiscount = (itemPrice, discountRate) => {
  // Check if the input is valid
  if (isNaN(itemPrice) || itemPrice <= 0 || isNaN(discountRate) || discountRate <= 0 || discountRate > 1) {
    throw new Error('Invalid input. Please provide valid item price and discount rate.');
  }

  // Calculate the discounted price
  const discountAmount = itemPrice * discountRate;
  const discountedPrice = itemPrice - discountAmount;

  return discountedPrice;
};

// Export the calculateDiscount function
module.exports = { calculateDiscount };