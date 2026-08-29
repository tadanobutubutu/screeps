import { dependencyGraphContent, indexContent } from './content';

function calculateDiscount(price, discountRate) {
  return price * (1 - discountRate);
}

export { calculateDiscount, dependencyGraphContent, indexContent };